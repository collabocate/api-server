import express, { IRouter } from 'express';
import {
  getAllUsersController,
  deleteAllUserController,
} from '@user/user.controller';
import {
  getAllCollabocateInstanceController
} from '@collabocate/instance.controller';
import { UserRole } from '@server/@api-user/user.model';
import { authenticateUserWithJWT, authorizeByUserRoles } from '@server/@api-auth/middlewares/auth.middleware';

const router: IRouter = express.Router();

router.get('/users', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin]), getAllUsersController);
router.get('/user-instances', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin]), getAllCollabocateInstanceController);
router.delete('/users', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin]), deleteAllUserController);

export { router };