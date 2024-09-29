import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @IsEmail()
  email: string;

  @IsNotEmpty()
  name:string;

  @IsNotEmpty()
  password: string;
  
}
