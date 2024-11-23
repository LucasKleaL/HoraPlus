import { db } from "../util/admin";
import Employee from "../model/Employee";
import AppRepository from "./AppRepository";
import * as admin from 'firebase-admin';
import DepartmentRepository from "./DepartmentRepository";
import RoleRepository from "./RoleRepository";

class EmployeeRepository extends AppRepository 
{
    departmentRepository!: DepartmentRepository;
    roleRepository!: RoleRepository;
    
    constructor() {
        super();
        this.departmentRepository = new DepartmentRepository();
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
            const newDepartment = await this.addDepartment(newEmployee.department, newEmployee.user_uid);
            const newRole = await this.addRole(newEmployee.role, newEmployee.user_uid);
            newEmployee.department = newDepartment;
            newEmployee.role = newRole;

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

    async addDepartment(department: any, userUid: string): Promise<{ uid: string, title: string }> {
        try {
            if (typeof department === 'string') {
                try {
                    const newDepartment = {
                        title: department,
                        user_uid: userUid,
                    }
                    const newDepartmentDoc = await this.departmentRepository.add(newDepartment);
                    if (newDepartmentDoc) {
                        department = {
                            uid: newDepartmentDoc.uid,
                            title: newDepartmentDoc.title
                        }
                    }
                } catch(error) {
                    console.error("Error on Employee add: ", error);
                    throw error;
                }
            } else {
                department = {
                    uid: department.uid,
                    title: department.title
                }
            }

            return department;
        } catch (error) {
            console.error("Error on Employee addDepartment: ", error);
            throw error;
        }
    }

    async addRole(role: any, userUid: string): Promise<{ uid: string, title: string }> {
        try {
            if (typeof role === 'string') {
                try {
                    const newRole = {
                        title: role,
                        user_uid: userUid,
                    }
                    const newRoleDoc = await this.roleRepository.add(newRole);
                    if (newRoleDoc) {
                        role = {
                            uid: newRoleDoc.uid,
                            title: newRoleDoc.title
                        }
                    }
                } catch(error) {
                    console.error("Error on Employee add: ", error);
                    throw error;
                }
            } else {
                role = {
                    uid: role.uid,
                    title: role.title
                }
            }

            return role;
        } catch (error) {
            console.error("Error on Employee addRole: ", error);
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