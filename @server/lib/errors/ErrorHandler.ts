import { NextFunction, Response, Request } from 'express';
import { CustomErrorInterface, HttpCode } from '@lib/errors/CustomError';
import { error } from '@lib/helpers';

class ErrorHandler {

  public handleError(err: CustomErrorInterface, res: Response): void {
    error(err.message);
    res
     .status(err.status || HttpCode.INTERNAL_SERVER_ERROR)
     .json({
      success: false,
      error: {
        status: err.status || HttpCode.INTERNAL_SERVER_ERROR,
        message: err.message
      }
    });
  }

}

export const errorHandler = new ErrorHandler();

const checkMongooseErrorKeyName = (err: CustomErrorInterface): string => {
  const keyNames = Object.keys(err.keyPattern);
  if (keyNames[0] === 'email'){
    return keyNames[0] as string;
  }
  else if (keyNames[0] === 'user'){
    return keyNames[1] as string;
  }
}

export const handleMongooseError = (err: CustomErrorInterface, req: Request, res: Response, next: NextFunction) => {
  //====== Mongoose Specific Error Property =======
  if (err.code === 11000){
    const keyName = checkMongooseErrorKeyName(err);
    err.status = 400;
    err.message = `Duplicate Error: ${keyName} already exist`;
  }
  //===============================================
  next();
}