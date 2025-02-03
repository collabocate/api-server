import express, { IRouter } from 'express';
import { getAppController } from '@server/@api-home/app.controller';

const router: IRouter = express.Router();

router.get('/', getAppController);

export { router };
