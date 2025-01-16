import { IsOptional } from 'class-validator';

export class CategoryPaginationDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  name?: string;

  @IsOptional()
  url?: string;
}
