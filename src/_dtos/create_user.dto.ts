import {
  IsDateString,
  IsOptional,
  IsString,
  IsEmail,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString({ message: 'Name must be a string' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters long' })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Password for the user’s account',
    example: 'securePassword123',
  })
  @IsString({ message: 'Password must be a string' })
  @Length(8, 100, {
    message: 'Password must be between 8 and 100 characters long',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Optional refresh token for obtaining new access tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsOptional()
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken?: string;

  @ApiPropertyOptional({
    description: 'User’s date of birth, if available',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date string' })
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'User’s gender, if specified',
    example: 'male',
  })
  @IsOptional()
  @IsString({ message: 'Gender must be a string' })
  @Length(1, 10, { message: 'Gender must be between 1 and 10 characters long' })
  gender?: string;

  @ApiPropertyOptional({
    description: 'User’s address, if provided',
    example: '123 Main St',
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @Length(1, 255, {
    message: 'Address must be between 1 and 255 characters long',
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'User’s phone number, if provided',
    example: '+123456789',
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @Length(1, 20, {
    message: 'Phone number must be between 1 and 20 characters long',
  })
  phoneNumber?: string;
}
