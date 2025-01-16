import { IsOptional } from 'class-validator';

export class EpisodePaginationDto {
  @IsOptional()
  page?: number = 1; 

  @IsOptional()
  limit?: number = 10; 

  @IsOptional()
  title?: string;  

  @IsOptional()
  album?: string; 

  @IsOptional()
  artist?: string; 
  
  @IsOptional()
  description?: string; 

  @IsOptional()
  isPremium?: boolean; 

  @IsOptional()
  isTop?: boolean; 
}
