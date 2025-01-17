import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEpisodeDto {
  @ApiProperty({
    description: 'Title of the episode',
    example: 'Episode 1: The Beginning',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  title: string;

  @ApiProperty({
    description: 'Name of the album to which this episode belongs',
    example: 'The Great Journey',
  })
  @IsString({ message: 'Album must be a string' })
  @IsNotEmpty({ message: 'Album must not be empty' })
  album: string;

  @ApiProperty({
    description: 'Name of the artist responsible for this episode',
    example: 'John Doe',
  })
  @IsString({ message: 'Artist must be a string' })
  @IsNotEmpty({ message: 'Artist must not be empty' })
  artist: string;

  @ApiPropertyOptional({
    description: 'Optional URL to the artwork associated with this episode',
    example: 'http://example.com/artwork.jpg',
  })
  @IsOptional()
  artwork?: string;

  @ApiProperty({
    description: 'URL where the episode can be accessed or streamed',
    example: 'http://example.com/url.mp3',
  })
  @IsString({ message: 'URL must be a string' })
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'Brief description of the episode',
    example: 'This episode covers the beginning of the journey.',
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description must not be empty' })
  description: string;

  @ApiProperty({
    description:
      'Unique MongoDB ID of the chapter to which this episode belongs',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsMongoId({ message: 'Invalid Chapter ID' })
  @IsNotEmpty({ message: 'Chapter ID must not be empty' })
  chapterId: string;
}
