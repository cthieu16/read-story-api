import { IsOptional } from 'class-validator';

export class ChapterPaginationDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  isPremium?: boolean;

  @IsOptional()
  bookId?: string;
}
