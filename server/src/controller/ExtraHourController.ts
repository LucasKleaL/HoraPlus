import { Request, Response } from "express";
import ExtraHour from "../model/ExtraHour";
import ExtraHourRepository from "../repository/ExtraHourRepository";

const extraHourRepository = new ExtraHourRepository;

class ExtraHourController {

    async add(req: Request, res: Response): Promise<void>
    {
        try {
            const extraHour: ExtraHour = req.body;
            const result = await extraHourRepository.add(extraHour);

            res.status(201).json({ statusCode: 201, extraHour: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to add extraHour: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'ExtraHour/failed-add', message: error.message });
            }
        }
    }

    async getById(req: Request, res: Response): Promise<void>
    {
        try {
            const uid = req.params.uid;
            const result = await extraHourRepository.getById(uid);

            if (result) {
                res.status(200).json({ statusCode: 200, extraHour: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "ExtraHour/not-found" });
            }

        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to get ExtraHour by id: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'ExtraHour/failed-getById', message: error.message });
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
                const previousPageSnapshot = await extraHourRepository.getNextPageByUser(
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
            const totalExtraHoursSnapshot = await extraHourRepository.getTotalByUser(userUid);
            const currentPageSnapshot = await extraHourRepository.getNextPageByUser(
                userUid,
                limit,
                lastDocument,
            );
            const extraHours = currentPageSnapshot.extraHours.map((doc: any) => {
                const data = doc;
                return { ...data, uid: doc.id };
            });

            res.status(200).json({ extraHours, total: totalExtraHoursSnapshot, currentPage: page })
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to get all ExtraHours by User: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'ExtraHours/failed-getAllByUser', message: error.message });
            }
        }
    }

    async update(req: Request, res: Response): Promise<void>
    {
        try {
            const uid = req.params.uid;
            const updatedExtraHour = req.body;
            const extraHour = await extraHourRepository.getById(uid);

            if (extraHour) {
                const result = await extraHourRepository.update(updatedExtraHour, uid);
                res.status(201).json({ statusCode: 201, extraHour: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "ExtraHour/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to update extraHour: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'ExtraHour/failed-update', message: error.message });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void>
    {
        try {
            const uid:string = req.params.uid;
            const extraHour = await extraHourRepository.getById(uid);
            if (extraHour) {
                const result = await extraHourRepository.delete(uid);
                res.status(200).json({ statusCode: 200, result: result });
            } else {
                res.status(404).json({ statusCode: 404, error: 'ExtraHour/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to delete ExtraHour: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'ExtraHour/failed-delete', message: error.message });
            }
        }
    }

}

export default ExtraHourController;