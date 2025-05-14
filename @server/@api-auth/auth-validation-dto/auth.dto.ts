import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, MinLength, Matches} from 'class-validator';

export class AuthDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/, {message: 'password must be a mix of lowercase letter(s), uppercase letter(s), number(s) and symbol(s)'})
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;
}