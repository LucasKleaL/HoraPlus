import { Request, Response } from "express";
import DayOffRepository from "../repository/DayOffRepository";
import DayOff from "../model/DayOff";

const dayOffRepository = new DayOffRepository();

export default class DayOffController
{
    async add(req: Request, res: Response): Promise<void>
    {
        try {
            const dayOff: DayOff = req.body;
            const result = await dayOffRepository.add(dayOff);

            res.status(201).json({ statusCode: 201, dayOff: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("DayOff/failed-add ", error.message);
                res.status(500).json({ statusCode: 500, error: "DayOff/failed-add", message: error.message });
            }
        }
    }

    async getById(req: Request, res: Response): Promise<void>
    {
        try {
            const uid = req.params.uid;
            const result = await dayOffRepository.getById(uid);

            if (result) {
                res.status(200).json({ statusCode: 200, dayOff: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "DayOff/not-found" });
            }

        } catch (error) {
            if (error instanceof Error) {
                console.error("DayOff/failed-getById ", error.message);
                res.status(500).json({ statusCode: 500, error: "DayOff/failed-getById", message: error.message });
            }
        }
    }

    async getAllByUser(req: Request, res: Response): Promise<void>
    {
        try {
            const userUid = req.params.uid;
            const result = await dayOffRepository.getAllByUser(userUid);

            if (result) {
                res.status(200).json({ statusCode: 200, daysOff: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "DayOff/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("DayOff/failed-getAllByUser ", error.message);
                res.status(500).json({ statusCode: 500, error: "DayOff/failed-getAllByUser", message: error.message });
            }
        }
    }

    async getAllByEmployee(req: Request, res: Response): Promise<void>
    {
        try {
            const userUid = req.params.uid;
            const result = await dayOffRepository.getAllByEmployee(userUid);

            if (result) {
                res.status(200).json({ statusCode: 200, daysOff: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "DayOff/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("DayOff/failed-getAllByEmployee ", error.message);
                res.status(500).json({ statusCode: 500, error: "DayOff/failed-getAllByEmployee", message: error.message });
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
                const previousPageSnapshot = await dayOffRepository.getNextPageByUser(
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
            const totalDaysOffSnapshot = await dayOffRepository.getTotalByUser(userUid);
            const currentPageSnapshot = await dayOffRepository.getNextPageByUser(
                userUid,
                limit,
                lastDocument,
            );
            const daysOff = currentPageSnapshot.docs.map((doc: any) => {
                const data = doc;
                return { ...data, uid: data.uid };
            });

            res.status(200).json({ daysOff, total: totalDaysOffSnapshot, currentPage: page })
        } catch (error) {
            if (error instanceof Error) {
                console.error("DayOff/failed-getAllByUser ", error.message);
                res.status(500).json({ statusCode: 500, error: "DayOff/failed-getAllByUser", message: error.message });
            }
        }
    }

    async update(req: Request, res: Response): Promise<void>
    {
        try {
            const uid = req.params.uid;
            const updatedDayOff = req.body;
            const dayOff = await dayOffRepository.getById(uid);

            if (dayOff) {
                const result = await dayOffRepository.update(updatedDayOff, uid);
                res.status(201).json({ statusCode: 201, dayOff: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "DayOff/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("DayOff/failed-update ", error.message);
                res.status(500).json({ statusCode: 500, error: "DayOff/failed-update", message: error.message });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void>
    {
        try {
            const uid:string = req.params.uid;
            const dayOff = await dayOffRepository.getById(uid);
            if (dayOff) {
                const result = await dayOffRepository.delete(uid);
                res.status(200).json({ statusCode: 200, result: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "DayOff/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("DayOff/failed-delete ", error.message);
                res.status(500).json({ statusCode: 500, error: "DayOff/failed-delete", message: error.message });
            }
        }
    }
}