import { NextFunction, Request, Response } from 'express';
import {
  getAllUsersService,
  getOneUserService,
  deleteOneUserService,
  updateOneUserPropertyValueService,
  updateUserPropertyValuesService,
  deleteAllUserService,
  createAdminUserService,
} from './user.service';
import { success } from '@lib/helpers';
import { ReqUser } from '@ts-types/index';
import { error } from '@lib/helpers';

// const routeName = 'user';
// const item = `${routeName}-item`;

let response: { [key: string]: unknown } = {};

export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsersService();
    response = {
      success: true,
      message: `SUCCESS: All users succesfully retrieved`,
      count: users.length,
      data: users.map(user => {
          return {
            _id: user._id,
            email: user.email,
            email_verified: user.email_verified,
            role: user.role,
            instances: user.instance.map(instance => {
              return {
                _id: instance._id,
                global: instance.global,
                instance_name: instance.instance_name,
                github: {
                  user_name: instance.github.user_name,
                  repo_name: instance.github.repo_name
                },
                createAt: instance.createdAt,
                updatedAt: instance.updatedAt
              }
            }),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
      }),
    };
    success(`SUCCESS: All users succesfully retrieved`);
    return res.status(200).json(response);
    
  } catch (err) {
    next(err);
  }
}

export const getOneUserController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const user = await getOneUserService(req.user._id);
    const response = {
      success: true,
      message: `SUCCESS: User succesfully retrieved`,
      data: {
        _id: user._id,
        email: user.email,
        email_verified: user.email_verified,
        role: user.role,
        instances: user.instance.map(instance => {
          return {
            _id: instance._id,
            global: instance.global,
            instance_name: instance.instance_name,
            github: {
              user_name: instance.github.user_name,
              repo_name: instance.github.repo_name
            },
            createAt: instance.createdAt,
            updatedAt: instance.updatedAt
          }
        }),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
    success(`SUCCESS: User succesfully retrieved`);
    return res.status(200).json(response);
    
  } catch (err) {
    next(err);
  }
}

export const deleteOneUserController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    await deleteOneUserService(req.user._id);
    response = {
      success: true,
      message: `SUCCESS: User successfully deleted`,
      data: {},
    };
    success(`SUCCESS: User successfully deleted`);
    return res.status(201).json(response);
    
  } catch (err) {
    next(err);
  }
};

export const updateOneUserPropertyValueController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const id: string = req.user._id;
    await updateOneUserPropertyValueService(req.user._id, req.body);
    response = {
      success: true,
      message: `PATCH update request for ID ${id} successful!`,
      data: {},
    };
    success(`PATCH update request for ID ${id} successful!`);
    return res.status(200).json(response);
    
  } catch (err) {
    next(err);
  } 
}

export const updateUserPropertyValuesController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const id: string = req.user._id;
    await updateUserPropertyValuesService(req.user._id, req.body);
    response = {
      success: true,
      message: `PUT update request for ID ${id} successful!`,
      data: {},
    };
    success(`PUT update request for ID ${id} successful!`);
    return res.status(200).json(response);
    
  } catch (err) {
    next(err);
  }
}

export const createAdminUserController = async () => {
  try {
    await createAdminUserService();
  } catch (err) {
    error(`ERROR: Could not Find or Create An Admin User\n${err.message}`);
  }
}

//------------------------------------------------------------------------------------------//
export const deleteAllUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await deleteAllUserService();
    const response = {
      success: true,
      message: `${user.deletedCount} user(s) deleted successfully!`,
      data: {},
    };
    success(response.message);
    return res.status(201).json(response);
    
  } catch (err) {
    next(err);
  }
};
//------------------------------------------------------------------------------------------//