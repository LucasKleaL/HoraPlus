import express, { RequestHandler } from 'express';
import UserController from '../controller/UserController';
import { Joi, celebrate } from 'celebrate';

const userRouter = express.Router();
const userController = new UserController();

userRouter.post('/users',
    celebrate({
        body: Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8),
            name: Joi.string().required().max(50),
        })
    }), userController.add as RequestHandler
);

userRouter.get(
    '/users/:uid',
    userController.getById as RequestHandler
);

userRouter.patch(
    '/users/:uid',
    celebrate({
        body: Joi.object({
            email: Joi.string().email(),
            password: Joi.string().min(8),
            name: Joi.string().max(50),
        }).min(1)
    }),
    userController.update as RequestHandler
);

userRouter.post('/users/login',
    celebrate({
        body: Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8),
        })
    }), userController.login as RequestHandler
);

export default userRouter;