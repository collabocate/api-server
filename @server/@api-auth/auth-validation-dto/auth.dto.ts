import { passwordMinLength, passwordRegex, passwordValidationMessage } from '@validation/validate.dto.middleware';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, MinLength, Matches} from 'class-validator';

export class AuthDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @Matches(passwordRegex, {message: passwordValidationMessage})
  @MinLength(passwordMinLength)
  @IsString()
  @IsNotEmpty()
  password: string;
}