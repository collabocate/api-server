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
    success: true,
    message: message.success.get,
    count: docs.length,
    data: docs,
  }
  success(message.success.get);
  return res.status(200).json(response);
}

export const createIssueController =  async (req: Request, res: Response) => {
  const docs = await createIssueService(req);
  response = {
    success: true,
    message: message.success.issues.submitted,
    data: {
      url: docs.html_url,
      number: docs.number,
    },
  }
  success(message.success.issues.submitted);
  return res.status(201).json(response);
}

export const getPullRequestsController =  async (req: Request, res: Response) => {
  const docs = await getPullRequestsService();
  response = {
    success: true,
    message: message.success.get,
    count: docs.length,
    data: docs,
  }
  success(message.success.get);
  return res.status(200).json(response);
}

export const getRepositoriesController =  async (req: Request, res: Response) => {
  const docs = await getRepositoriesService();
  response = {
    success: true,
    message: message.success.get,
    count: docs.length,
    data: docs,
  }
  success(message.success.get);
  return res.status(200).json(response);
}

export const getIssueTemplatesController = async (req: Request, res: Response) => {
    const docs = await getIssueTemplatesService();
    const response = {
      success: true,
      message: message.success.get,
      count: docs.length,
      data: docs,
    };
    success(message.success.get);
    return res.status(200).json(response);
}

export const getIssueTemplatesContentController = async (req: Request, res: Response) => {
  const docs = await getIssueTemplatesContentService();
  const response = {
    success: true,
    message: message.success.get,
    count: docs.length,
    data: docs,
  };
  success(message.success.get);
  return res.status(200).json(response);
};