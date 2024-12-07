import { db } from "../util/admin";
import AppRepository from "./AppRepository";
import * as admin from 'firebase-admin';
import DayOff from "../model/DayOff";
import EmployeeRepository from "./EmployeeRepository";
import Employee from "../model/Employee";

export default class DayOffRepository extends AppRepository {

    employeeRepository!: EmployeeRepository;
    
    constructor() {
        super();
        this.employeeRepository = new EmployeeRepository();
    }

    async add(dayOff: DayOff): Promise<any>
    {
        try {
            let result;
            const newDayOff = {
                ...dayOff,
                date: this.formatDateTime(new Date(Date.parse(dayOff.date))),
                created: this.getDateTime(),
                modified: null,
                deleted: null,
            };

            await db.collection("DaysOff").add(newDayOff)
                .then(async (docRef) => {
                    const dayOffRef = await docRef.get();
                    const dayOffData = dayOffRef.data();
                    result = {
                        uid: docRef.id,
                        ...dayOffData,
                    }
                })
                .catch((error) => {
                    console.error("Error on DayOff add: ", error);
                    throw error;
                })

            return result;
        } catch (error) {
            console.error("Error on DayOff add: ", error);
            throw error;
        }
    }

    async getById(uid: string): Promise<any>
    {
        try {
            let result;
            await db.collection("DaysOff")
                .doc(uid)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        const dayOff = doc.data();
                        if (!dayOff?.deleted) {
                            result = dayOff;
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error to get DaysOff by id from Firestore: ", error);
                    throw error;
                })

            return result;
        } catch (error) {
            console.error("Error to get DaysOff by id: ", error);
            throw error;
        }
    }

    async getAllByUser(userUid: string): Promise<any>
    {
        try {
            let query = db
                .collection("DaysOff")
                .where("user_uid", '==', userUid)
                .where("deleted", "==", null);
            const snapshot = await query.get();
            const daysOff = snapshot.docs.map((doc) => {
                const data = doc.data();
                return { ...data, uid: doc.id };
            });

            return daysOff;
        } catch (error) {
            console.error("Error to get all Days Off by User: ", error);
            throw error;
        }
    }

    async getAllByEmployee(employeeUid: string): Promise<any>
    {
        try {
            let query = db
                .collection("DaysOff")
                .where("employee_uid", '==', employeeUid)
                .where("deleted", "==", null);
            const snapshot = await query.get();
            const daysOff = snapshot.docs.map((doc) => {
                const data = doc.data();
                return { ...data, uid: doc.id };
            });

            return daysOff;
        } catch (error) {
            console.error("Error to get all Days Off by Employee: ", error);
            throw error;
        }
    }

    async getTotalByUser(userUid: string): Promise<number>
    {
        try {
            const querySnapshot = await db
                .collection("DaysOff")
                .where("user_uid", "==", userUid)
                .where("deleted", "==", null)
                .get();

            return querySnapshot.size;
        } catch (error) {
            console.error("Error on DayOff getTotalByUser: ", error);
            throw error;
        }
    }

    async getNextPageByUser(userUid: string, limit: number, lastDocument?: admin.firestore.QueryDocumentSnapshot): Promise<any> {
        try {
            let query = db
                .collection("DaysOff")
                .where("user_uid", '==', userUid)
                .where("deleted", "==", null)
                .orderBy("created")
                .limit(limit);
            if (lastDocument) {
                query = query.startAfter(lastDocument);
            }
            const snapshot = await query.get();

            const dayOffsWithEmployees = await Promise.all(snapshot.docs.map(async (doc) => {
                const dayOffData = doc.data();
                const employee: Employee = await this.employeeRepository.getById(dayOffData.employee_uid);
                return { ...dayOffData, uid: doc.id, employee: employee };
            }));

            return { daysOff: dayOffsWithEmployees, lastDocument: snapshot.docs[snapshot.docs.length - 1] };
        } catch (error) {
            console.error("Error on DayOff getNextPageByUser: ", error);
            throw error;
        }
    }

    async update(dayOff: DayOff, uid: string): Promise<any>
    {
        try {
            const updatedDayOff = {
                ...dayOff,
                modified: this.getDateTime(),
            }
            await db.collection("DaysOff").doc(uid).update(updatedDayOff)

            return this.getById(uid);
        } catch (error) {
            console.error("Error on DayOff update: ", error);
            throw error;
        }
    }

    async delete(uid: string): Promise<any>
    {
        try {
            const dayOffRef = db.collection("DaysOff").doc(uid);
            await dayOffRef.update({
                deleted: this.getDateTime(),
            });
        } catch (error) {
            console.error("Error on DayOff delete: ", error);
            throw error;
        }
    }
}