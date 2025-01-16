import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password of the user.',
    example: 'current_password123',
  })
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString({ message: 'Current password must be a string' })
  currentPassword: string;

  @ApiProperty({
    description: 'New password for the user (6-20 characters).',
    example: 'new_password456',
  })
  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'New password must be a string' })
  @Length(6, 20, {
    message: 'New password must be between 6 and 20 characters',
  })
  newPassword: string;
}
