import { db } from "../util/admin";
import ExtraHour from "../model/ExtraHour";
import AppRepository from "./AppRepository";
import * as admin from 'firebase-admin';
import Employee from "../model/Employee";
import EmployeeRepository from "./EmployeeRepository";

class ExtraHourRepository extends AppRepository {

    employeeRepository!: EmployeeRepository;
    
    constructor() {
        super();
        this.employeeRepository = new EmployeeRepository();
    }

    async add(extraHour: ExtraHour): Promise<any>
    {
        try {
            let result;
            const newExtraHour = {
                ...extraHour,
                date: this.formatDateTime(new Date(Date.parse(extraHour.date))),
                created: this.getDateTime(),
                modified: null,
                deleted: null,
            };

            await db.collection("ExtraHours").add(newExtraHour)
                .then(async (docRef) => {
                    result = docRef.get();
                })
                .catch((error) => {
                    console.error("Error on ExtraHour add: ", error);
                    throw error;
                })

            return result;
        } catch (error) {
            console.error("Error on ExtraHour add: ", error);
            throw error;
        }
    }

    async getById(uid: string): Promise<any>
    {
        try {
            let result;
            await db.collection("ExtraHours")
                .doc(uid)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        const extraHour = doc.data();
                        if (!extraHour?.deleted) {
                            result = extraHour;
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error to get ExtraHour by id from Firestore: ", error);
                    throw error;
                })

            return result;
        } catch (error) {
            console.error("Error to get ExtraHour by id: ", error);
            throw error;
        }
    }

    async getTotalByUser(userUid: string): Promise<number>
    {
        try {
            const querySnapshot = await db
                .collection("ExtraHours")
                .where("user_uid", "==", userUid)
                .where("deleted", "==", null)
                .get();

            return querySnapshot.size;
        } catch (error) {
            console.error("Error to get total ExtraHours by user: ", error);
            throw error;
        }
    }

    async getNextPageByUser(userUid: string, limit: number, lastDocument?: admin.firestore.QueryDocumentSnapshot): Promise<any>
    {
        try {
            let query = db
                .collection("ExtraHours")
                .where("user_uid", '==', userUid)
                .where("deleted", "==", null)
                .orderBy("created")
                .limit(limit);
            if (lastDocument) {
                query = query.startAfter(lastDocument);
            }
            const snapshot = await query.get();

            const extraHoursWithEmployees = await Promise.all(snapshot.docs.map(async (doc) => {
                const extraHourData = doc.data();
                const employee: Employee = await this.employeeRepository.getById(extraHourData.employee_uid);
                return { ...extraHourData, uid: doc.id, employee: employee };
            }));

            return { extraHours: extraHoursWithEmployees, lastDocument: snapshot.docs[snapshot.docs.length - 1] };
        } catch (error) {
            console.error("Error on ExtraHour getNextPageByUser: ", error);
            throw error;
        }
    }

    async update(extraHour: ExtraHour, uid: string): Promise<any>
    {
        try {
            const updatedExtraHour = {
                ...extraHour,
                modified: this.getDateTime(),
            }
            await db.collection("ExtraHours").doc(uid).update(updatedExtraHour)

            return this.getById(uid);
        } catch (error) {
            console.error("Error on ExtraHour update: ", error);
            throw error;
        }
    }

    async delete(uid: string): Promise<any>
    {
        try {
            const extraHourRef = db.collection("ExtraHours").doc(uid);
            await extraHourRef.update({
                deleted: this.getDateTime(),
            });
        } catch (error) {
            console.error("Error to delete User: ", error);
            throw error;
        }
    }

}

export default ExtraHourRepository;