import User from "../model/User";
import UserRepository from "../repository/UserRepository";
import { Request, Response } from "express";

const userRepository = new UserRepository;

class UserController {

    async add(req: Request, res: Response): Promise<void> {
        try {
            const user: User = req.body;
            const result = await userRepository.add(user);
            res.status(201).json({ statusCode: 201, token: result })
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to add user:', error.message);
                if (error.message.includes('The email address is already in use by another account.')) {
                    res.status(409).json({ statusCode: 409, error: 'email/already-exists', message: error.message });
                } else {
                    res.status(500).json({ statusCode: 500, error: 'user/failed-add', message: error.message });
                }
            }
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const uid = req.params.uid;
            const result = await userRepository.getById(uid);
            if (result) {
                res.status(200).json({ statusCode: 200, user: result })
            } else {
                res.status(404).json({ statusCode: 404, error: 'user/not-found' })
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to get user by id:', error.message);
                res.status(500).json({ statusCode: 500, error: 'user/failed-getById', message: error.message });
            }
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const uid = req.params.uid;
            const user: User = req.body;
            user.uid = uid;
            const result = await userRepository.update(user);

            if (result) {
                res.status(201).json({ statusCode: 201, token: result })
            } else {
                res.status(404).json({ statusCode: 404, error: 'user/not-found' })
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to update user:', error.message);
                res.status(500).json({ statusCode: 500, error: 'user/failed-update', message: error.message });
            }
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const user:User = req.body;
            console.log('controller' + user);
            const accessToken: string = req.header('accessToken') ?? '';
            const result = await userRepository.login(user, accessToken);

            res.status(200).send({ statusCode: 200, customToken: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to login user:', error.message);
                if (error.message.includes('auth/invalid-credential')) {
                    res.status(401).json({ statusCode: 401, error: 'auth/invalid-credential', message: error.message });
                }
                else if (error.message.includes('temporarily disabled')) {
                    res.status(403).json({ statusCode: 403, error: 'auth/access-disabled', message: error.message });
                } else {
                    res.status(500).json({ statusCode: 500, error: 'auth/failed-login', message: error.message });
                }
            }
        }
    }

}

export default UserController;