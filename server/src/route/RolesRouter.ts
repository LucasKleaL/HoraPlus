import express, { RequestHandler } from 'express';
import { Joi, celebrate } from 'celebrate';
import RolesController from '../controller/RolesController';

const rolesRouter = express.Router();
const rolesController = new RolesController();

rolesRouter.post('/roles',
    celebrate({
        body: Joi.object({
            title: Joi.string().required().min(2).max(50),
            description: Joi.string().max(50),
            user_uid: Joi.string().required()
        })
    }), rolesController.add as RequestHandler
);

rolesRouter.get(
    '/roles/user/:uid',
    rolesController.getAllByUser as RequestHandler
)

rolesRouter.get(
    '/roles/:uid',
    rolesController.getById as RequestHandler
);

export default rolesRouter;