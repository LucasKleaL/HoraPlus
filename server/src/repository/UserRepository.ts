import User from "../model/User";
import { db, firebaseAdmin } from "../util/admin";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AppRepository from "./AppRepository";

class UserRepository extends AppRepository {
    
    async add(user: User): Promise<any> {
        try {
            let result;
            await firebaseAdmin.auth().createUser({
                email: user.email,
                password: user.password,
                displayName: user.name,
            }).then(async (userRecord) => {
                const created = this.getDateTime();
                await db.collection("Users").doc(userRecord.uid).set({
                    email: user.email,
                    name: user.name,
                    system_role: user.system_role,
                    role: user.role,
                    department: user.department,
                    created: created,
                    modified: null,
                    deleted: null,
                }).then(async () => {
                    const customClaims = { 
                        displayName: user.name, 
                        system_role: user.system_role, 
                        role: user.role, 
                        department: user.department,
                    };
                    await firebaseAdmin.auth().createCustomToken(userRecord.uid, customClaims)
                        .then((customToken) => {
                            console.log("Successfully created a new user: ", userRecord.uid);
                            result = customToken;
                        }).catch((error) => {
                            console.error("Error creating a custom token: ", error);
                            throw error;
                        });
                }).catch((error) => {
                    console.error("Error creating user register in Firestore: ", error);
                    throw error;
                });
            }).catch((error) => {
                console.error("Error on auth createUser: ", error);
                throw error;
            });

            return result;
        } catch (error) {
            console.error("Error on user add: ", error);
            throw error;
        }
    }

    async getById(uid: string): Promise<any> {
        try {
            let result;
            await db.collection("Users")
                .doc(uid)
                .get()
                .then(async (userDoc) => {
                    if (!userDoc.exists) {
                        result = null;
                    } else {
                        const userData = userDoc.data();
                        if (!userData?.deleted) {
                            result = userData;
                        } else {
                            result = null
                        }
                    }
                }).catch((error) => {
                    console.error("Error to get User by id from Firestore: ", error);
                    throw error;
                })

            return result;
        } catch (error) {
            console.error("Error on user getById: ", error);
            throw error;
        }
    }

    async update(user: User): Promise<any> {
        try {
            const { uid, email, password, name, system_role, role, department } = user;
                if (uid) {
                const modified = this.getDateTime();
                
                const updatedUser = Object.fromEntries(
                    Object.entries({
                        email,
                        password,
                        name,
                        system_role,
                        role,
                        department,
                        modified: modified
                    }).filter(([key, value]) => value !== undefined)
                );
                if (Object.keys(updatedUser).length === 0) {
                    return null;
                }

                try {
                    if (email) {
                        await firebaseAdmin.auth().updateUser(uid, { email: email });
                    }
                    if (password) {
                        await firebaseAdmin.auth().updateUser(uid, { password: password });
                    }
                    if (name) {
                        await firebaseAdmin.auth().updateUser(uid, { displayName: name });
                    }

                    await db.collection("Users").doc(uid).update(updatedUser);
                    const customToken = await this.createCustomToken(uid);
                    
                    return customToken;
                } catch (error) {
                    console.error("Error on user update: ", error);
                    throw error;
                }
            }
            
        } catch (error) {
            console.error("Error on user update: ", error);
            throw error;
        }
    }

    async login(user: User, accessToken: string): Promise<any> {
        try {
            const auth = getAuth();
            let result;
            console.log('repository' + user);
            if (accessToken) {
                await firebaseAdmin.auth()
                    .verifyIdToken(accessToken)
                    .then((decodedToken) => {
                        console.log('Successfully user login with accessToken. ' + decodedToken.uid);
                        result = decodedToken;
                    })
                    .catch((error) => {
                        console.error('Error on user login with accessToken: ' + error);
                        throw error;
                    });
            } else {
                await signInWithEmailAndPassword(auth, user.email, user.password)
                    .then(async (userCredential) => {
                        const userAuth = userCredential.user;
                        result = await this.createCustomToken(userAuth.uid);
                        console.log(result);
                    })
                    .catch((error) => {
                        console.error("Error on user login: ", error);
                        throw error;
                    });
            }

            return result;
        } catch (error) {
            console.error("Error on user login: ", error);
            throw error;
        }
    }

    async createCustomToken(uid: string): Promise<string> {
        const userDoc = await db.collection("Users").doc(uid).get();
        if (userDoc.exists) {
            const userData = userDoc.exists ? userDoc.data() : null;
            if (!userData) {
                return `User with uid ${uid} does not exist or has no data`;
            } else {
                const customClaims = {
                    uid: userData.id,
                    system_role: userData.system_role,
                    role: userData.role,
                    department: userData.department,
                };
                const customToken = await firebaseAdmin.auth().createCustomToken(uid, customClaims);

                return customToken;
            }
        } else {
            return `User with uid ${uid} does not exist.`;
        }
    }

}

export default UserRepository;