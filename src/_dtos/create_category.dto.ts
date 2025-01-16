import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Title of the category',
    example: 'The Great Gatsby',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;

  @ApiPropertyOptional({
    description: 'Optional URL with more information about the category',
    example: 'http://example.com/category-url',
  })
  @IsOptional()
  url?: string;
}
