import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty} from 'class-validator';

export class UpdateUserDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  password: string;
}