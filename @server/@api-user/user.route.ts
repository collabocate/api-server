import express, { IRouter } from 'express';
import {
  getOneUserController,
  updateOneUserController,
  deleteOneUserController
} from '@server/@api-user/user.controller';
import { UserRole } from '@server/@api-user/user.model';
import { authenticateUserWithJWT, authorizeByUserRoles } from '@server/@api-auth/middlewares/auth.middleware';

const router: IRouter = express.Router();

router.get('/', authenticateUserWithJWT, authorizeByUserRoles([UserRole.User, UserRole.Admin]), getOneUserController);
router.patch('/', authenticateUserWithJWT, authorizeByUserRoles([UserRole.User, UserRole.Admin]), updateOneUserController);
router.delete('/', authenticateUserWithJWT, authorizeByUserRoles([UserRole.User]), deleteOneUserController);

export { router };