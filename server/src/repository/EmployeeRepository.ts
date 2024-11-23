import { db } from "../util/admin";
import Employee from "../model/Employee";
import AppRepository from "./AppRepository";
import * as admin from 'firebase-admin';
import RoleRepository from "./RoleRepository";

class EmployeeRepository extends AppRepository 
{
    roleRepository!: RoleRepository;

    constructor() {
        super();
        this.roleRepository = new RoleRepository();
    }
    
    async add(employee: Employee): Promise<any>
    {
        try {
            let result;
            const newEmployee = {
                ...employee,
                created: this.getDateTime(),
                modified: null,
                deleted: null,
            };

            if (typeof newEmployee.role === 'string') {
                try {
                    const newRole = {
                        title: newEmployee.role,
                        user_uid: newEmployee.user_uid,
                    }
                    const newRoleDoc = await this.roleRepository.add(newRole);
                    if (newRoleDoc) {
                        newEmployee.role = {
                            uid: newRoleDoc.uid,
                            title: newRoleDoc.title
                        }
                    }
                } catch(error) {
                    console.error("Error on Employee add: ", error);
                    throw error;
                }
            } else {
                newEmployee.role = {
                    uid: newEmployee.role.uid,
                    title: newEmployee.role.title
                }
            }

            await db.collection("Employees").add(newEmployee)
                .then(async (docRef) => {
                    result = {
                        uid: docRef.id,
                        ...newEmployee
                    };
                })
                .catch((error) => {
                    console.error("Error on Employee add: ", error);
                    throw error;
                });

            return result;
        } catch (error) {
            console.error("Error on Employee add: ", error);
            throw error;
        }
    }

    async getById(uid: string): Promise<any>
    {
        try {
            let result;
            await db.collection("Employees")
                .doc(uid)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        const employee = doc.data();
                        if (!employee?.deleted) {
                            result = employee;
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error on Employee getById: ", error);
                    throw error;
                })

            return result;
        } catch (error) {
            console.error("Error on Employee getById: ", error);
            throw error;
        }
    }

    async getTotalEmployeesByUser(userUid: string): Promise<number>
    {
        try {
            console.log(userUid);
            const querySnapshot = await db
                .collection("Employees")
                .where("user_uid", "==", userUid)
                .where("deleted", "==", null)
                .get();

            return querySnapshot.size;
        } catch (error) {
            console.error("Error on Employee getTotalEmployeesByUser: ", error);
            throw error;
        }
    }

    async getNextPageByUser(userUid: string, limit: number, lastDocument?: admin.firestore.QueryDocumentSnapshot): Promise<any> {
        try {
            let query = db
                .collection("Employees")
                .where("user_uid", '==', userUid)
                .where("deleted", "==", null)
                .orderBy("created")
                .limit(limit);
            if (lastDocument) {
                query = query.startAfter(lastDocument);
            }
            const snapshot = await query.get();
    
            const employeesWithExtraHours = await Promise.all(snapshot.docs.map(async (doc) => {
                const employeeData = doc.data();
                const extraHoursSnapshot = await db.collection("ExtraHours")
                    .where("employee.uid", "==", doc.id)
                    .get();
                const extraHours = extraHoursSnapshot.docs.map(extraHourDoc => extraHourDoc.data());
                return { ...employeeData, uid: doc.id, extraHours };
            }));
    
            return { employees: employeesWithExtraHours, lastDocument: snapshot.docs[snapshot.docs.length - 1] };
        } catch (error) {
            console.error("Error on Employee getNextPageByUser: ", error);
            throw error;
        }
    }

    async update(employee: Employee, uid: string): Promise<any>
    {
        try {
            const updatedEmployee = {
                ...employee,
                modified: this.getDateTime(),
            }
            await db.collection("Employees").doc(uid).update(updatedEmployee)

            return this.getById(uid);
        } catch (error) {
            console.error("Error on Employee update: ", error);
            throw error;
        }
    }

    async delete(uid: string): Promise<any>
    {
        try {
            const employeeRef = db.collection("Employees").doc(uid);
            await employeeRef.update({
                deleted: this.getDateTime(),
            });
        } catch (error) {
            console.error("Error on Employee delete: ", error);
            throw error;
        }
    }
}

export default EmployeeRepository;