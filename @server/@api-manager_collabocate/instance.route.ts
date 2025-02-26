import express, { IRouter } from 'express';
import {
  getAllCollabocateInstanceController,
  createCollabocateInstanceController,
  getCollabocateInstanceController,
  getOneCollabocateInstanceController,
  updateOneCollabocateInstanceController,
  deleteOneCollabocateInstanceController,
} from '@collabocate/instance.controller';
import { authenticateUserWithJWT, authorizeByUserRoles } from '@auth/middlewares/auth.middleware';
import { UserRole } from '@user/user.model';

const router: IRouter = express.Router();

router.get('/', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), getCollabocateInstanceController);
router.post('/', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), createCollabocateInstanceController);
router.get('/:settingID', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), getOneCollabocateInstanceController);
router.patch('/:settingID', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), updateOneCollabocateInstanceController);
router.delete('/:settingID', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), deleteOneCollabocateInstanceController);

export { router };
