import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({
    description: 'Title of the chapter',
    example: 'Chapter 1: Introduction',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  name: string;

  @ApiProperty({
    description: 'Brief description of the chapter',
    example: 'This chapter covers the basics of the book.',
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description must not be empty' })
  description: string;

  @ApiPropertyOptional({
    description: 'Optional URL with additional resources about this chapter',
    example: 'http://example.com/chapter-url',
  })
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'Unique MongoDB ID of the book to which this chapter belongs',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsMongoId({ message: 'Invalid Book ID' })
  @IsNotEmpty({ message: 'Book ID must not be empty' })
  bookId: string;
}
