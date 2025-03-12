import { badRequestErr } from '@lib/errors/Errors';
import { ReqUser } from '@ts-types/index';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Response, NextFunction } from 'express';

export function validateDto(DtoClass: any) {
  return async (req: ReqUser, res: Response, next: NextFunction) => {
    try {
      const dtoInstance = plainToInstance(DtoClass, req.body, {
        excludeExtraneousValues: true
      }); // Convert request body to DTO

      // Get the allowed properties from the DTO
      const dtoObj = instanceToPlain(dtoInstance);
      const allowedKeys = Object.keys(dtoObj);
      const requestKeys = Object.keys(req.body);

      // Check for extra fields
      const extraKeys = requestKeys.filter((key) => !allowedKeys.includes(key));
      if (extraKeys.length > 0) {
        badRequestErr(`Validation Failed: request body contains unallowed properties - ${extraKeys.join(', ')}`);
      }
      
      const errors = await validate(dtoInstance);
      if (errors.length > 0) {
        badRequestErr(`Validation Failed: ${errors}`);
      }
      next(); 
    }
    catch (err) {
      next(err)
    }
  };
}