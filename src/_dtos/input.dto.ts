import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, Min } from 'class-validator';

export type SortableParameters = Record<string, 'desc' | 'asc'>;
export type FilterableParameters = Record<string, unknown>;

export class CounterDto {
  @Transform((v: TransformFnParams) => filterQueryToObject(v.value))
  @IsOptional()
  @IsObject()
  readonly filter?: FilterableParameters;
}

export class CollectionDto {
  @Transform((v: TransformFnParams) => filterQueryToObject(v.value))
  @IsOptional()
  @IsObject()
  readonly filter?: FilterableParameters;

  @IsOptional()
  @IsString()
  readonly sort?: string;

  readonly sorter?: SortableParameters;

  @Type(() => Number)
  @Min(0)
  readonly page?: number = 1;

  @Type(() => Number)
  @Min(0)
  readonly limit?: number = 10;
}

function filterQueryToObject(v: string): Record<string, unknown> {
  return JSON.parse(v);
}
