import express, { IRouter } from 'express';
import {
  createTokenController,
  getAllTokenController,
  getOneTokenController,
  getTokenController,
} from '@token/token.controller';
import { authenticateUserWithJWT, authorizeByUserRoles } from '@auth/middlewares/auth.middleware';
import { UserRole } from '@user/user.model';

const router: IRouter = express.Router();

router.get('/all', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin]), getAllTokenController);
router.get('/', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), getTokenController);
router.post('/', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), createTokenController);
router.get('/:id', authenticateUserWithJWT, authorizeByUserRoles([UserRole.Admin, UserRole.User]), getOneTokenController);
export { router };
