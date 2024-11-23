import { Request, Response } from "express";
import RolesRepository from "../repository/RoleRepository";
import Role from "../model/Role";

const rolesRepository = new RolesRepository;

export default class RolesController {

    async add(req: Request, res: Response): Promise<void>
    {
        try {
            const role: Role = req.body;
            const result = await rolesRepository.add(role);

            res.status(201).json({ statusCode: 201, role: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to add Role: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'Role/failed-add', message: error.message });
            }
        }
    }

    async getAllByUser(req: Request, res: Response): Promise<void>
    {
        try {
            const userUid = req.params.uid;
            const result = await rolesRepository.getAllByUser(userUid);

            if (result) {
                res.status(200).json({ statusCode: 200, roles: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "Role/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to get all Roles by User id: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'Role/failed-getAllByUserId', message: error.message });
            }
        }
    }

    async getById(req: Request, res: Response): Promise<void>
    {
        try {
            const uid = req.params.uid;
            const result = await rolesRepository.getById(uid);

            if (result) {
                res.status(200).json({ statusCode: 200, role: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "Role/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to get Role by id: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'Role/failed-getById', message: error.message });
            }
        }
    }
}