import { db } from "../util/admin";
import ExtraHour from "../model/ExtraHour";
import AppRepository from "./AppRepository";
import * as admin from 'firebase-admin';

class ExtraHourRepository extends AppRepository {

    async add(extraHour: ExtraHour): Promise<any>
    {
        try {
            let result;
            const newExtraHour = {
                ...extraHour,
                created: this.getDateTime(),
                modified: null,
                deleted: null,
            };

            await db.collection("ExtraHours").add(newExtraHour)
                .then(async (docRef) => {
                    result = docRef;
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

    async getTotalExtraHoursByUser(userUid: string): Promise<number>
    {
        try {
            const querySnapshot = await db
                .collection("ExtraHours")
                .where('worker.id', '==', userUid)
                .where('deleted', '==', null)
                .get();

            return querySnapshot.size;
        } catch (error) {
            console.error("Error to get total ExtraHours by user: ", error);
            throw error;
        }
    }

    async getNextPageByUser(userUid: string, limit: number, lastDocument?: admin.firestore.QueryDocumentSnapshot): Promise<admin.firestore.QuerySnapshot>
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

            return snapshot;
        } catch (error) {
            console.error("Error on getNextPageByUser: ", error);
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