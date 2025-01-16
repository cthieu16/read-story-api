import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create_user.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  resetToken?: string;

  @IsOptional()
  @IsDate()
  resetTokenExpiration?: Date;
}
