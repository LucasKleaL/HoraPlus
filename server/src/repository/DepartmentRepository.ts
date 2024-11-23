import { db } from "../util/admin";
import AppRepository from "./AppRepository";
import Department from "../model/Department";

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
}

export default DepartmentRepository;