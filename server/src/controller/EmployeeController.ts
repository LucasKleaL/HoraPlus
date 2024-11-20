import { Request, Response } from "express";
import Employee from "../model/Employee";
import EmployeeRepository from "../repository/EmployeeRepository";

const employeeRepository = new EmployeeRepository();

class EmployeeController
{
    async add(req: Request, res: Response): Promise<void>
    {
        try {
            const employee: Employee = req.body;
            const result = await employeeRepository.add(employee);

            res.status(201).json({ statusCode: 201, employee: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Employee/failed-add ", error.message);
                res.status(500).json({ statusCode: 500, error: "Employee/failed-add", message: error.message });
            }
        }
    }

    async getById(req: Request, res: Response): Promise<void>
    {
        try {
            const uid = req.params.uid;
            const result = await employeeRepository.getById(uid);

            if (result) {
                res.status(200).json({ statusCode: 200, employee: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "Employee/not-found" });
            }

        } catch (error) {
            if (error instanceof Error) {
                console.error("Employee/failed-getById ", error.message);
                res.status(500).json({ statusCode: 500, error: "Employee/failed-getById", message: error.message });
            }
        }
    }

    async getAllByUser(req: Request, res: Response): Promise<void>
    {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const userUid = req.params.user_uid;
            let lastDocument;

            if (page > 1) {
                const previousPageSnapshot = await employeeRepository.getNextPageByUser(
                    userUid,
                    limit,
                    lastDocument
                );
                const previousDocuments = previousPageSnapshot.docs;
                const totalDocuments = previousDocuments.length;

                if (totalDocuments >= limit) {
                    lastDocument = previousDocuments[totalDocuments - 1];
                }
            }
            const totalEmployeesSnapshot = await employeeRepository.getTotalEmployeesByUser(userUid);
            const currentPageSnapshot = await employeeRepository.getNextPageByUser(
                userUid,
                limit,
                lastDocument,
            );
            const employees = currentPageSnapshot.employees.map((doc: any) => {
                const data = doc;
                return { ...data, uid: data.uid };
            });

            res.status(200).json({ employees, total: totalEmployeesSnapshot, currentPage: page })
        } catch (error) {
            if (error instanceof Error) {
                console.error("Employee/failed-getAllByUser ", error.message);
                res.status(500).json({ statusCode: 500, error: "Employee/failed-getAllByUser", message: error.message });
            }
        }
    }

    async update(req: Request, res: Response): Promise<void>
    {
        try {
            const uid = req.params.uid;
            const updatedEmployee = req.body;
            const employee = await employeeRepository.getById(uid);

            if (employee) {
                const result = await employeeRepository.update(updatedEmployee, uid);
                res.status(201).json({ statusCode: 201, employee: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "Employee/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Employee/failed-update ", error.message);
                res.status(500).json({ statusCode: 500, error: "Employee/failed-update", message: error.message });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void>
    {
        try {
            const uid:string = req.params.uid;
            const employee = await employeeRepository.getById(uid);
            if (employee) {
                const result = await employeeRepository.delete(uid);
                res.status(200).json({ statusCode: 200, result: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "Employee/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Employee/failed-delete ", error.message);
                res.status(500).json({ statusCode: 500, error: "Employee/failed-delete", message: error.message });
            }
        }
    }
}

export default EmployeeController;