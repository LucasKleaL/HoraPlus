import { Request, Response } from "express";
import DepartmentRepository from "../repository/DepartmentRepository";
import Department from "../model/Department";

const departmentRepository = new DepartmentRepository;

export default class DepartmentController {

    async add(req: Request, res: Response): Promise<void>
    {
        try {
            const department: Department = req.body;
            const result = await departmentRepository.add(department);

            res.status(201).json({ statusCode: 201, department: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to add Department: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'Department/failed-add', message: error.message });
            }
        }
    }

    async getById(req: Request, res: Response): Promise<void>
    {
        try {
            const uid = req.params.uid;
            const result = await departmentRepository.getById(uid);

            if (result) {
                res.status(200).json({ statusCode: 200, department: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "Department/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to get Department by id: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'Department/failed-getById', message: error.message });
            }
        }
    }

    async getAllByUser(req: Request, res: Response): Promise<void>
    {
        try {
            const userUid = req.params.uid;
            const result = await departmentRepository.getAllByUser(userUid);

            if (result) {
                res.status(200).json({ statusCode: 200, departments: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "Department/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to get all Departments by User id: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'Department/failed-getAllByUser', message: error.message });
            }
        }
    }

    async getAllByUserPaginated(req: Request, res: Response): Promise<void>
    {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const userUid = req.params.user_uid;
            let lastDocument;

            if (page > 1) {
                const previousPageSnapshot = await departmentRepository.getNextPageByUser(
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
            const totalDepartmentsSnapshot = await departmentRepository.getTotalByUser(userUid);
            const currentPageSnapshot = await departmentRepository.getNextPageByUser(
                userUid,
                limit,
                lastDocument,
            );
            const departments = currentPageSnapshot.docs.map((doc: any) => {
                const data = doc.data();
                return { ...data, uid: data.uid };
            });

            res.status(200).json({ departments, total: totalDepartmentsSnapshot, currentPage: page })
        } catch (error) {
            if (error instanceof Error) {
                console.error("Department/failed-getAllByUserPaginated ", error.message);
                res.status(500).json({ statusCode: 500, error: "Department/failed-getAllByUserPaginated", message: error.message });
            }
        }
    }
}