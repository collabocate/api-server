import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, Matches, MinLength} from 'class-validator';

export class UpdateUserDto {
  @Expose()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/, {message: 'password must be a mix of lowercase letter(s), uppercase letter(s), number(s) and symbol(s)'})
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;
}