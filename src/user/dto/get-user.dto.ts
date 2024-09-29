import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetUserDto   {

  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  rowPage:number;

  @IsString()
  filter: string;
  
}
