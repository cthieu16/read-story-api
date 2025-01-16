/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CollectionProperties } from '../property/property';
import { CollectionDto } from 'src/_dtos/input.dto';
import { SorterParser } from '../sorter/parser';
import { FilterParser } from '../filter/parser';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private propsClass: typeof CollectionProperties) {}

  transform(value: CollectionDto, _metadata: ArgumentMetadata) {
    const filterParams = new FilterParser(this.propsClass).parse(value);
    const sorterParams = new SorterParser(this.propsClass).parse(value.sort);
    const { sort: _, ...rest } = value;

    return { ...rest, filter: filterParams, sorter: sorterParams };
  }
}
