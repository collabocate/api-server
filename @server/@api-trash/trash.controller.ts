import { NextFunction, Response } from 'express';
import {
  restoreOneTrashService,
  getOneTrashService,
  getTrashService,
  getOneSpecificTrashService
} from '@trash/trash.service';
import { success } from '@lib/helpers';
import { ReqUser } from '@ts-types/index';
// import { error } from '@lib/helpers';

const routeName = 'trash';
const item = `${routeName}`;

let response: { [key: string]: unknown } = {};


export const restoreOneTrashController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const param_id = req.params.id;
    const user_id: string = req.user._id;

    await restoreOneTrashService(user_id, param_id);

    response = {
      success: true,
      message: `${item} with id:${param_id} restored successfully and deleted from trash!`,
      data: {}
    }
    success(`${item} with id:${param_id} restored successfully and deleted from trash!`);
    return res.status(200).json(response); 
  } catch (err) {
    next(err);
  }
};

export const getTrashController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user._id
    const docs = await getTrashService(user_id);
    response = {
      success:true,
      message: `all ${item}s for ${user_id} gotten successfully!`,
      count: docs.length,
      data: docs.map(doc => {
        return {
          _id: doc._id,
          collectionName: doc.collectionName,
          trashedDocument: doc.trashedDocument,
          trashedAt: doc.trashedAt,
          toBeDeletedAt: doc.toBeDeletedAt,
          trashLifetime: (doc.toBeDeletedAt.getTime() - Date.now())/1000,
          user: doc.user._id
        }
      })
    };
    success(`all ${item}s gotten successfully!`);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export const getOneTrashController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const param_id = req.params.id;
    const user_id: string = req.user._id;
    const doc = await getOneTrashService(user_id, param_id);
    response = {
      success: true,
      message: `${item} with id:${param_id} gotten successfully!`,
      data: {
        _id: doc._id,
        collectionName: doc.collectionName,
        trashedDocument: doc.trashedDocument,
        trashedAt: doc.trashedAt,
        toBeDeletedAt: doc.toBeDeletedAt,
        trashLifetime: (doc.toBeDeletedAt.getTime() - Date.now())/1000,
        user: doc.user._id
      }
    }
    success(`${item} with id:${param_id} gotten successfully!`);
    return res.status(200).json(response);  
  } catch (err) {
    next(err);
  }
}

export const getOneSpecificTrashController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const param_id = req.params.id;
    const user_id: string = req.user._id;
    const collection_name: string = req.params.collection_name;
    const doc = await getOneSpecificTrashService(user_id, param_id, collection_name);
    response = {
      success: true,
      message: `${item} with id:${param_id} gotten successfully!`,
      data: {
        _id: doc._id,
        collectionName: doc.collectionName,
        trashedDocument: doc.trashedDocument,
        trashedAt: doc.trashedAt,
        toBeDeletedAt: doc.toBeDeletedAt,
        trashLifetime: (doc.toBeDeletedAt.getTime() - Date.now())/1000,
        user: doc.user._id
      }
    }
    success(`${item} with id:${param_id} gotten successfully!`);
    return res.status(200).json(response);  
  } catch (err) {
    next(err);
  }
}