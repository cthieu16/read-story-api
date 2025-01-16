import { IsOptional } from 'class-validator';

export class BookPaginationDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  name?: string;

  @IsOptional()
  author?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  isPremium?: boolean;

  @IsOptional()
  isTop10Year?: boolean;

  @IsOptional()
  categoryId?: string;
}
