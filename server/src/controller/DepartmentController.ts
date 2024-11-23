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
}