import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail} from 'class-validator';

export class SignupUserDto {
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  password: string;
}