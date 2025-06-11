import express, { IRouter } from 'express';
import { createIssueController, getIssuesController, getPullRequestsController, getRepositoriesController,getIssueTemplatesController, getIssueTemplatesContentController, revokeGithubAccessTokenController } from '@api-external/github.controller';
import { authenticateUserWithJWT, authorizeByUserRoles } from '@auth/middlewares/auth.middleware';
import { UserRole } from '@user/user.model';

const router: IRouter = express.Router();

router.get('/issues', 
            authenticateUserWithJWT,
            authorizeByUserRoles([UserRole.Admin, UserRole.User]),
            getIssuesController);
//-------------------------------------------
router.post('/issues',
            authenticateUserWithJWT,
            authorizeByUserRoles([UserRole.Admin, UserRole.User]),
            createIssueController);
//-------------------------------------------
router.get('/issue-templates',  
            authenticateUserWithJWT,
            authorizeByUserRoles([UserRole.Admin, UserRole.User]),
            getIssueTemplatesController);
//-------------------------------------------
router.get('/templates/issues', 
            authenticateUserWithJWT,
            authorizeByUserRoles([UserRole.Admin, UserRole.User]),
            getIssueTemplatesContentController);
//-------------------------------------------
router.delete('/revoke-token', 
            authenticateUserWithJWT,
            authorizeByUserRoles([UserRole.Admin, UserRole.User]),
            revokeGithubAccessTokenController);
//-------------------------------------------
router.get('/pull-requests', getPullRequestsController);
router.get('/repositories', getRepositoriesController);

export { router };
