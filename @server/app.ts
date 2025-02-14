import 'express-async-errors';
import express, { Express, NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from '@lib/errors/ErrorHandler';
import { CustomErrorInterface } from '@lib/errors/CustomError';
import { notFoundErr } from '@lib/errors/Errors';
import { router as appRouter } from '@server/@api-home/app.route';
import { router as externalApiRouter } from '@api-external/github.route';
import { router as authRouter } from '@server/@api-auth/auth.route';
import { router as userRouter } from '@server/@api-user/user.route';
import { router as collabocateInstanceRouter } from '@collabocate/instance.route';
import { ChatRoutes } from '@server/@api-chat/chat.route';
import { configurePassport } from '@server/@api-auth/passport/passport.auth.config';
import { ChatController } from './@api-chat/chat.controller';
import { ChatService } from './@api-chat/chat.service';

const dotEnv = dotenv.config();
dotenvExpand.expand(dotEnv);

const app: Express = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [`http://localhost:${process.env.CLIENT_APP_PORT}`, `${process.env.CLIENT_APP_URL}`],
    credentials: true
  }
});

ChatService.getInstance().setIO(io);

app.use(morgan('dev'));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(cors({ origin: [`http://localhost:${process.env.CLIENT_APP_PORT}`, `${process.env.CLIENT_APP_URL}`] }));
configurePassport(app);

//====== Use Routers =======
app.use('/', appRouter);
app.use('/external/github', externalApiRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/collabocate/instance', collabocateInstanceRouter)
const chatRoutes = new ChatRoutes(io);
app.use('/api/chat', chatRoutes.getRouter());
//==========================

const chatController = new ChatController();
io.on('connection', (socket) => {
  chatController.handleSocket(socket);
});


//========= Throw Route Not Found Error ==========
app.use(() => {
  notFoundErr("Route Not Found")
});
//==========================================


//====== Error handler Middleware ==========
app.use((err: CustomErrorInterface, req: Request, res: Response, next: NextFunction) => {
  errorHandler.handleError(err, res);
  next()
});
//==========================================

export { app, httpServer };
