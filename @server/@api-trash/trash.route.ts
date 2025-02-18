import express, { IRouter } from 'express';
import {
  restoreOneTrashController,
  getOneTrashController,
  getTrashController,
  getOneSpecificTrashController
} from '@trash/trash.controller';
import { authenticateUserWithJWT, authorizeByUserRoles } from '@auth/middlewares/auth.middleware';
import { UserRole } from '@user/user.model';

const router: IRouter = express.Router();

router.get('/restore/:id', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), restoreOneTrashController);
router.get('/', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), getTrashController);
router.get('/:id', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), getOneTrashController);
router.get('/:collection_name/:id', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), getOneSpecificTrashController);

export { router };
