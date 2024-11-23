import express, { RequestHandler } from 'express';
import { Joi, celebrate } from 'celebrate';
import EmployeeController from '../controller/EmployeeController';

const employeeRouter = express.Router();
const employeeController = new EmployeeController();

employeeRouter.post(
    '/employees',
    celebrate({
        body: Joi.object({
            user_uid: Joi.string().required(),
            name: Joi.string().required().max(30),
            role: Joi.required(),
            department: Joi.required(),
        })
    }), employeeController.add as RequestHandler
);

employeeRouter.get(
    '/employees/:uid',
    employeeController.getById as RequestHandler
);

employeeRouter.get(
    '/employees/user/:user_uid',
    employeeController.getAllByUser as RequestHandler
);

employeeRouter.patch(
    '/employees/:uid',
    celebrate({
        body: Joi.object({
            name: Joi.string().optional().max(30),
            role: Joi.array(),
            department: Joi.array(),
        }).min(1)
    }),
    employeeController.update as RequestHandler
);

employeeRouter.delete(
    '/employees/:uid',
    employeeController.delete as RequestHandler
);

export default employeeRouter;