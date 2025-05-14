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

      const validation_errors = await validate(dtoInstance);

      let validation_error_conditions: string[] = [""];
      if (validation_errors.length > 0) {
        validation_errors.forEach((validation_error)=>{
          const property_check = validation_error.value;
          if(property_check === undefined) {
            const error_msg = `must have ${validation_error.property} property`;
            validation_error_conditions = [...validation_error_conditions, error_msg];
          }
          else{
            const constraints = validation_error.constraints;
            const constraint_msgs = Object.values(constraints);
            constraint_msgs.forEach((constrain_msg)=>{
              validation_error_conditions = [...validation_error_conditions, constrain_msg];
            })
          }
        });
        validation_error_conditions.shift();
        badRequestErr(`Validation Failed: request body must meet the following conditions - ${validation_error_conditions.join(', ')}`);
      }
      next(); 
    }
    catch (err) {
      next(err)
    }
  };
}