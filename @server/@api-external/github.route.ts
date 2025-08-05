import express, { IRouter } from 'express';
import { createIssueController, getIssuesController, getPullRequestsController, getRepositoriesController,getIssueTemplatesController, getIssueTemplatesContentController, revokeGithubAccessTokenController } from '@api-external/github.controller';
import { authenticateUserWithJWT, authorizeByUserRoles } from '@auth/middlewares/auth.middleware';
import { UserRole } from '@user/user.model';

const router: IRouter = express.Router();

router.get('/issues', getIssuesController);
//-------------------------------------------
router.post('/issues',
            authenticateUserWithJWT,
            authorizeByUserRoles([UserRole.Admin, UserRole.User]),
            createIssueController);
router.post('/issues-unauthenticated', createIssueController);
//-------------------------------------------
router.get('/issue-templates', getIssueTemplatesController);
router.get('/pull-requests', getPullRequestsController);
router.get('/repositories', getRepositoriesController);
router.get('/templates/issues', getIssueTemplatesContentController);
//-------------------------------------------
router.delete('/revoke-token', 
            authenticateUserWithJWT,
            authorizeByUserRoles([UserRole.Admin, UserRole.User]),
            revokeGithubAccessTokenController);

export { router };
