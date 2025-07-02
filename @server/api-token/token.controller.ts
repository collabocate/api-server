import { NextFunction, Response } from 'express';
import {
  createTokenService,
  getAllTokenService,
  getOneTokenService,
  getTokenService,
} from '@token/token.service';
import { success } from '@lib/helpers';
import { ReqUser } from '@ts-types/index';
// import { error } from '@lib/helpers';

// const routeName = 'token';
// const item = `${routeName}`;

let response: { [key: string]: unknown } = {};


export const createTokenController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const token = await createTokenService(req.user._id, req.body);
    response = {
      success: true,
      message: `SUCCESS: All items succesfully retrieved`,
      data: {
        _id: token._id,
        token: token.token,
        issuer: token.issuer,
        user_id: token.user._id
      }
    };
    success(`SUCCESS: All tokens succesfully retrieved`);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export const getAllTokenController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const tokens = await getAllTokenService();
    response = {
      success: true,
      message: `SUCCESS: All tokens succesfully retrieved`,
      count: tokens.length,
      data: tokens.map((token)=>{
        return {
          _id: token._id,
          token: token.token,
          issuer: token.issuer,
          user_id: token.user._id
        }
      })
    };
    success(`SUCCESS: All tokens succesfully retrieved`);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export const getTokenController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const tokens = await getTokenService(req.user._id);
    response = {
      success: true,
      message: `SUCCESS: All tokens succesfully retrieved`,
      count: tokens.length,
      data: tokens.map((token)=>{
        return {
          _id: token._id,
          token: token.token,
          issuer: token.issuer,
          user_id: token.user._id
        }
      })
    };
    success(`SUCCESS: All tokens succesfully retrieved for user: ${req.user._id}`);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export const getOneTokenController = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    const token = await getOneTokenService(req.user._id, req.params.id);
    response = {
      success: true,
      message: `SUCCESS: token succesfully retrieved`,
      data: {
        _id: token._id,
        token: token.token,
        issuer: token.issuer,
        user_id: token.user._id
      }
    };
    success(`SUCCESS: token succesfully retrieved`);
    return res.status(200).json(response);
    
  } catch (err) {
    next(err);
  }
}