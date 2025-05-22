import { NextFunction, Request, Response } from 'express';
import {
  createCollabocateInstanceService,
  getCollabocateInstanceService,
  getOneCollabocateInstanceService,
  deleteOneCollabocateInstanceService,
  updateOneCollabocateInstanceService,
  getAllCollabocateInstanceService,
} from '@collabocate/instance.service';
import { success } from '@lib/helpers';
import { ReqUser } from '@ts-types/index';
// import { error } from '@lib/helpers';

const routeName = 'collabocate';
const item = `${routeName} instance`;

let response: { [key: string]: unknown } = {};

export const createCollabocateInstanceController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const doc = await createCollabocateInstanceService(req.user._id, req.body);
    response = {
      success: true,
      message: `${item} created successfully!`,
      data: {
        _id: doc._id,
        global: doc.global,
        instance_name: doc.instance_name,
        github: {
          user_name: doc.github.user_name,
          repo_name: doc.github.repo_name
        },
        user_id: doc.user._id,
        createAt: doc.createdAt,
        updatedAt: doc.updatedAt
      },
    }
    success(`${item} CREATED successfully!`);
    return res.status(201).json(response);  
  } catch (err) {
    next(err);
  }
}

export const getAllCollabocateInstanceController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const docs = await getAllCollabocateInstanceService();
    response = {
      success: true,
      message: `all ${item}s gotten successfully!`,
      count: docs.length,
      data: docs.map(doc => {
        return {
          _id: doc._id,
          global: doc.global,
          instance_name: doc.instance_name,
          github: {
            user_name: doc.github.user_name,
            repo_name: doc.github.repo_name
          },
          user_id: doc.user._id,
          createAt: doc.createdAt,
          updatedAt: doc.updatedAt
        }
      })
    };
    success(`all ${item}s gotten successfully!`);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export const getCollabocateInstanceController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user._id
    const docs = await getCollabocateInstanceService(user_id);
    response = {
      success: true,
      message: `all ${item}s for ${user_id} gotten successfully!`,
      count: docs.length,
      data: docs.map(doc => {
        return {
          _id: doc._id,
          global: doc.global,
          instance_name: doc.instance_name,
          github: {
            user_name: doc.github.user_name,
            repo_name: doc.github.repo_name
          },
          user_id: doc.user._id,
          createAt: doc.createdAt,
          updatedAt: doc.updatedAt
        }
      })
    };
    success(`all ${item}s gotten successfully!`);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export const getOneCollabocateInstanceController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user._id
    const id = req.params.settingID;
    const doc = await getOneCollabocateInstanceService(user_id, id);
    response = {
      success: true,
      message: `${item} with id:${id} gotten successfully!`,
      data: {
        _id: doc._id,
        global: doc.global,
        instance_name: doc.instance_name,
        github: {
          user_name: doc.github.user_name,
          repo_name: doc.github.repo_name
        },
        user_id: doc.user._id,
        createAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }
    }
    success(`${item} with id:${id} gotten successfully!`);
    return res.status(200).json(response);  
  } catch (err) {
    next(err);
  }
}

export const deleteOneCollabocateInstanceController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const param_id = req.params.settingID;
    const user_id: string = req.user._id;

    const doc = await deleteOneCollabocateInstanceService(user_id, param_id);

    response = {
      success: true,
      message: `${item} with id:${param_id} trashed successfully!`,
      data: {
        trashId: doc._id,
        trashCollectionName: doc.collectionName,
        userId: doc.user._id
      }
    }
    
    success(`${item} with id:${param_id} trashed successfully!`);
    return res.status(200).json(response); 
  } catch (err) {
    next(err);
  }
};

export const updateOneCollabocateInstanceController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.settingID;
    const doc = await updateOneCollabocateInstanceService(id, req.body);
    response = {
      success: true,
      message: `Update request for ID ${id} successful!`,
      data: {
        _id: doc._id,
        global: doc.global,
        instance_name: doc.instance_name,
        github: {
          user_name: doc.github.user_name,
          repo_name: doc.github.repo_name
        },
        user_id: doc.user._id,
        createAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }
    }
    success(`Update request for ID ${id} successful!`);
    return res.status(200).json(response);  
  } catch (err) {
    next(err);
  }
};