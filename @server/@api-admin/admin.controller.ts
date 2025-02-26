import { NextFunction, Request, Response } from 'express';
import {
  createAdminUserService,
} from './admin.service';
import { error } from '@lib/helpers';


let response: { [key: string]: unknown } = {};

export const createAdminUserController = async () => {
  try {
    await createAdminUserService();
  } catch (err) {
    error(`ERROR: Could not Find or Create An Admin User\n${err.message}`);
  }
}