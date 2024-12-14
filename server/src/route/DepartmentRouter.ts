import express, { RequestHandler } from 'express';
import { Joi, celebrate } from 'celebrate';
import DepartmentController from '../controller/DepartmentController';

const departmentRouter = express.Router();
const departmentController = new DepartmentController();

departmentRouter.post('/departments',
    celebrate({
        body: Joi.object({
            user_uid: Joi.string().required(),
            title: Joi.string().required().min(2).max(50),
            description: Joi.string().max(50),
            color: Joi.string().optional(),
        })
    }), departmentController.add as RequestHandler
);

departmentRouter.get(
    '/departments/user/:uid',
    departmentController.getAllByUser as RequestHandler
);

departmentRouter.get(
    '/departments/paginated/:user_uid',
    departmentController.getAllByUserPaginated as RequestHandler
);

departmentRouter.get(
    '/departments/:uid',
    departmentController.getById as RequestHandler
);

export default departmentRouter;