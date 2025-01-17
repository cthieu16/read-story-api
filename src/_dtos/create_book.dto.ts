import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'Title of the book',
    example: 'The Great Gatsby',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  name: string;

  @ApiProperty({
    description: 'Author of the book',
    example: 'Mr. Cuong',
  })
  @IsString({ message: 'Author must be a string' })
  @IsNotEmpty({ message: 'Author must not be empty' })
  author: string;

  @ApiProperty({
    description: 'Brief description of the book',
    example: 'A novel set in the 1920s about the mysterious Jay Gatsby.',
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description must not be empty' })
  description: string;

  @ApiPropertyOptional({
    description: 'Optional URL with more information about the book',
    example: 'http://example.com/book-url',
  })
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'Unique MongoDB ID of the book to which this chapter belongs',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsMongoId({ message: 'Invalid Category ID' })
  @IsNotEmpty({ message: 'Category ID must not be empty' })
  categoryId: string;
}
