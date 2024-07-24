import express, { RequestHandler } from 'express';
import { Joi, celebrate } from 'celebrate';
import ExtraHourController from '../controller/ExtraHourController';

const extraHourRouter = express.Router();
const extraHourController = new ExtraHourController();

extraHourRouter.post(
    '/extrahours',
    celebrate({
        body: Joi.object({
            user_uid: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.optional(),
            date: Joi.date().required(),
            amount: Joi.number().required(),
            employe_uid: Joi.string().required(),
        })
    }), extraHourController.add as RequestHandler
);

extraHourRouter.get(
    '/extrahours/:uid',
    extraHourController.getById as RequestHandler
);

extraHourRouter.get(
    '/extrahours/user/:user_uid',
    extraHourController.getAllByUser as RequestHandler
);

extraHourRouter.patch(
    '/extrahours/:uid',
    celebrate({
        body: Joi.object({
            title: Joi.string(),
            description: Joi.string().max(100),
            date: Joi.date(),
            amount: Joi.number(),
            employee_uid: Joi.string(),
        }).min(1)
    }),
    extraHourController.update as RequestHandler
);

extraHourRouter.delete(
    '/extrahours/:uid',
    extraHourController.delete as RequestHandler
);

export default extraHourRouter;