import { IsEmail, IsNumber } from 'class-validator';

export class UserQueryDto {
  @IsNumber()
  id?: number;

  @IsEmail()
  email?: string;
}
