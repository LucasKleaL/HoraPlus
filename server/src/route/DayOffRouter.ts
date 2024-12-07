import express, { RequestHandler } from 'express';
import { Joi, celebrate } from 'celebrate';
import DayOffController from '../controller/DayOffController';

const dayOffRouter = express.Router();
const dayOffController = new DayOffController();

dayOffRouter.post(
    '/daysoff',
    celebrate({
        body: Joi.object({
            user_uid: Joi.string().required(),
            employee_uid: Joi.string().required(),
            title: Joi.string().required().max(30),
            description: Joi.string().optional(),
            date: Joi.date().required(),
            amount: Joi.string().required(),
        })
    }), dayOffController.add as RequestHandler
);

dayOffRouter.get(
    '/daysoff/:uid',
    dayOffController.getById as RequestHandler
);

dayOffRouter.get(
    '/daysoff/user/:uid',
    dayOffController.getAllByUser as RequestHandler
);

dayOffRouter.get(
    '/daysoff/employee/:uid',
    dayOffController.getAllByEmployee as RequestHandler
);

dayOffRouter.get(
    '/daysoff/paginated/:user_uid',
    dayOffController.getAllByUserPaginated as RequestHandler
);

dayOffRouter.patch(
    '/daysoff/:uid',
    celebrate({
        body: Joi.object({
            user_uid: Joi.string().optional(),
            employee_uid: Joi.string().optional(),
            title: Joi.string().optional().max(30),
            description: Joi.string().optional(),
            date: Joi.date().optional(),
            amount: Joi.number().optional(),
        }).min(1)
    }),
    dayOffController.update as RequestHandler
);

dayOffRouter.delete(
    '/daysoff/:uid',
    dayOffController.delete as RequestHandler
);

export default dayOffRouter;