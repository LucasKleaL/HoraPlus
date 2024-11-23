import { db } from "../util/admin";
import AppRepository from "./AppRepository";
import * as admin from 'firebase-admin';
import Role from "../model/Role";

class RolesRepository extends AppRepository {

    async add(role: Role): Promise<any>
    {
        try {
            let result;
            const newRole = {
                ...role,
                created: this.getDateTime(),
                modified: null,
                deleted: null,
            };

            await db.collection("Roles").add(newRole)
                .then(async (docRef) => {
                    const roleRef = await docRef.get();
                    const roleData = roleRef.data();
                    result = {
                        uid: docRef.id,
                        ...roleData,
                    }
                })
                .catch((error) => {
                    console.error("Error on Role add: ", error);
                    throw error;
                })

            return result;
        } catch (error) {
            console.error("Error on Role add: ", error);
            throw error;
        }
    }

    async getAllByUser(userUid: string): Promise<any>
    {
        try {
            let query = db
                .collection("Roles")
                .where("user_uid", '==', userUid)
                .where("deleted", "==", null);
            const snapshot = await query.get();
            const roles = snapshot.docs.map((doc) => {
                const data = doc.data();
                return { ...data, uid: doc.id };
            });

            return roles;
        } catch (error) {
            console.error("Error to get all Roles: ", error);
            throw error;
        }
    }

    async getById(uid: string): Promise<any>
    {
        try {
            let result;
            await db.collection("Roles")
                .doc(uid)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        const role = doc.data();
                        if (!role?.deleted) {
                            result = role;
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error to get Role by id from Firestore: ", error);
                    throw error;
                })

            return result;
        } catch (error) {
            console.error("Error to get Role by id: ", error);
            throw error;
        }
    }
}

export default RolesRepository;