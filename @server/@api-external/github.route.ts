import express, { IRouter } from 'express';
import { createIssueController, getIssuesController, getPullRequestsController, getRepositoriesController,getIssueTemplatesController, getIssueTemplatesContentController } from '@api-external/github.controller';

const router: IRouter = express.Router();

router.get('/issues', getIssuesController);
//-------------------------------------------
router.post('/issues', createIssueController);
//-------------------------------------------
router.get('/issue-templates', getIssueTemplatesController);
router.get('/pull-requests', getPullRequestsController);
router.get('/repositories', getRepositoriesController);
router.get('/templates/issues', getIssueTemplatesContentController);

export { router };
