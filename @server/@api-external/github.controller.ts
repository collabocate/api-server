import { NextFunction, Request, Response } from 'express';
import { success } from '@lib/helpers';
import { createIssueService, getIssuesService, getPullRequestsService, getRepositoriesService,getIssueTemplatesService, getIssueTemplatesContentService, revokeGithubAccessTokenService } from '@api-external/github.service';
import { ReqUser } from '@ts-types/index';

let response: { [key: string]: unknown } = {};
const message = {
  success: {
    get: 'GET request successful!',
    issues: {
      submitted: 'Issue ticket successfully submitted!',
    },
  },
}

export const getIssuesController =  async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const docs = await getIssuesService(req.user._id);
    response = {
      success: true,
      message: message.success.get,
      count: docs.length,
      data: docs,
    }
    success(message.success.get);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export const createIssueController =  async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
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
  } catch (err) {
    next(err);
  }
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

export const getIssueTemplatesController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const docs = await getIssueTemplatesService(req.user._id);
    const response = {
      success: true,
      message: message.success.get,
      count: docs.length,
      data: docs,
    };
    success(message.success.get);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export const getIssueTemplatesContentController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const docs = await getIssueTemplatesContentService(req.user._id);
    const response = {
      success: true,
      message: message.success.get,
      count: docs.length,
      data: docs,
    };
    success(message.success.get);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const revokeGithubAccessTokenController =  async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const docs = await revokeGithubAccessTokenService(req.user._id);
    response = {
      success: true,
      message: "github access token successfully revoked",
      data: {
        docs
      },
    }
    success("github access token successfully revoked");
    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}