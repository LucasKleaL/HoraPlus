import { db } from "../util/admin";
import AppRepository from "./AppRepository";
import Department from "../model/Department";
import * as admin from 'firebase-admin';

class DepartmentRepository extends AppRepository {

    async add(department: Department): Promise<any>
    {
        try {
            let result;
            const newDepartment = {
                ...department,
                created: this.getDateTime(),
                modified: null,
                deleted: null,
            };

            await db.collection("Departments").add(newDepartment)
                .then(async (docRef) => {
                    const departmentRef = await docRef.get();
                    const departmentData = departmentRef.data();
                    result = {
                        uid: docRef.id,
                        ...departmentData,
                    }
                })
                .catch((error) => {
                    console.error("Error on Department add: ", error);
                    throw error;
                })

            return result;
        } catch (error) {
            console.error("Error on Department add: ", error);
            throw error;
        }
    }

    async getById(uid: string): Promise<any>
    {
        try {
            let result;
            await db.collection("Departments")
                .doc(uid)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        const department = doc.data();
                        if (!department?.deleted) {
                            result = department;
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error to get Department by id from Firestore: ", error);
                    throw error;
                })

            return result;
        } catch (error) {
            console.error("Error to get Department by id: ", error);
            throw error;
        }
    }

    async getAllByUser(userUid: string): Promise<any>
    {
        try {
            let query = db
                .collection("Departments")
                .where("user_uid", '==', userUid)
                .where("deleted", "==", null);
            const snapshot = await query.get();
            const departments = snapshot.docs.map((doc) => {
                const data = doc.data();
                return { ...data, uid: doc.id };
            });

            return departments;
        } catch (error) {
            console.error("Error to get all Departments: ", error);
            throw error;
        }
    }

    async getTotalByUser(userUid: string): Promise<number>
    {
        try {
            const querySnapshot = await db
                .collection("Departments")
                .where("user_uid", "==", userUid)
                .where("deleted", "==", null)
                .get();

            return querySnapshot.size;
        } catch (error) {
            console.error("Error on Employee getTotalDepartmentsByUser: ", error);
            throw error;
        }
    }

    async getNextPageByUser(userUid: string, limit: number, lastDocument?: admin.firestore.QueryDocumentSnapshot): Promise<any> {
        try {
            let query = db
                .collection("Departments")
                .where("user_uid", '==', userUid)
                .where("deleted", "==", null)
                .orderBy("created")
                .limit(limit);
            if (lastDocument) {
                query = query.startAfter(lastDocument);
            }
            const snapshot = await query.get();
    
            return snapshot;
            //return { departments: snapshot, lastDocument: snapshot.docs[snapshot.docs.length - 1] };
        } catch (error) {
            console.error("Error on Department getNextPageByUser: ", error);
            throw error;
        }
    }
    
}

export default DepartmentRepository;