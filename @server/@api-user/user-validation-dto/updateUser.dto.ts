import { passwordMinLength, passwordRegex, passwordValidationMessage } from '@validation/validate.dto.middleware';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, Matches, MinLength} from 'class-validator';

export class UpdateUserDto {
  @Expose()
  @Matches(passwordRegex, {message: passwordValidationMessage})
  @MinLength(passwordMinLength)
  @IsString()
  @IsNotEmpty()
  password: string;
}