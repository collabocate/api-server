import { Request, Response } from 'express';
import { success } from '@lib/helpers';
import { createIssueService, getIssuesService, getPullRequestsService, getRepositoriesService,getIssueTemplatesService, getIssueTemplatesContentService } from '@api-external/github.service';

let response: { [key: string]: unknown } = {};
const message = {
  success: {
    get: 'GET request successful!',
    issues: {
      submitted: 'Issue ticket successfully submitted!',
    },
  },
}

export const getIssuesController =  async (req: Request, res: Response) => {
  const docs = await getIssuesService();
  response = {
    count: docs.length,
    issues: docs,
  }
  success(message.success.get);
  return res.status(200).json(response);
}

export const createIssueController =  async (req: Request, res: Response) => {
  const docs = await createIssueService(req);
  response = {
    message: message.success.issues.submitted,
    issue: {
      url:docs.html_url,
      number:docs.number,
    },
  }
  success(message.success.issues.submitted);
  return res.status(201).json(response);
}

export const getPullRequestsController =  async (req: Request, res: Response) => {
  const docs = await getPullRequestsService();
  response = {
    count: docs.length,
    pull_requests: docs,
  }
  success(message.success.get);
  return res.status(200).json(response);
}

export const getRepositoriesController =  async (req: Request, res: Response) => {
  const docs = await getRepositoriesService();
  response = {
    count: docs.length,
    repositories: docs,
  }
  success(message.success.get);
  return res.status(200).json(response);
}

export const getIssueTemplatesController = async (req: Request, res: Response) => {
    const docs = await getIssueTemplatesService();
    const response = {
      count: docs.length,
      templates: docs,
    };
    success(message.success.get);
    return res.status(200).json(response);
}

export const getIssueTemplatesContentController = async (req: Request, res: Response) => {
  const docs = await getIssueTemplatesContentService();
  const response = {
    count: docs.length,
    templates: docs,
};
  success(message.success.get);
  return res.status(200).json(response);
};