import express, { IRouter } from 'express';
import {
  getAllUsersController,
  getOneUserController,
  deleteOneUserController,
  updateOneUserController,
  deleteAllUserController,
} from '@server/@api-user/user.controller';
import { UserRole } from '@server/@api-user/user.model';
import { authenticateUserWithJWT, authorizeByUserRoles } from '@server/@api-auth/middlewares/auth.middleware';
import { validateDto } from '@server/@api-validation/middlewares/validateDto';
import { UpdateUserDto } from './userDTO/updateUser.dto';

const router: IRouter = express.Router();

router.get('/all', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin]), getAllUsersController);
router.get('/', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), getOneUserController);

router.patch('/', validateDto(UpdateUserDto), authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), updateOneUserController);

router.delete('/', authenticateUserWithJWT, authorizeByUserRoles([UserRole.User]), deleteOneUserController);

//-----------------------------------------------------//
router.delete('/all', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin]), deleteAllUserController);
//-----------------------------------------------------//

export { router };