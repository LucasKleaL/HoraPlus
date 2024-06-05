import express, { Request, Response } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

class App {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(errors());
    }

    private routes(): void {
        // CORS origin config
        this.app.use(cors({
            origin: ['http://localhost:4200'],
        }));

        // Routes
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Hora+ server is running! 🛠️');
        });
        //this.app.use('/api');

        // Handle undefined routes
        this.app.use('*', (req, res) => {
            res.status(404).send("Make sure url is correct!");
        });
        // Celebrate error handler middleware
        this.app.use(errors());
    }

}

export default new App().app;