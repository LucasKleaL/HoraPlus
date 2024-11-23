import express, { RequestHandler } from 'express';
import { Joi, celebrate } from 'celebrate';
import DepartmentController from '../controller/DepartmentController';

const departmentRouter = express.Router();
const departmentController = new DepartmentController();

departmentRouter.post('/departments',
    celebrate({
        body: Joi.object({
            title: Joi.string().required().min(2).max(50),
            description: Joi.string().max(50),
            user_uid: Joi.string().required()
        })
    }), departmentController.add as RequestHandler
);

departmentRouter.get(
    '/departments/user/:uid',
    departmentController.getAllByUser as RequestHandler
)

departmentRouter.get(
    '/departments/:uid',
    departmentController.getById as RequestHandler
);

export default departmentRouter;