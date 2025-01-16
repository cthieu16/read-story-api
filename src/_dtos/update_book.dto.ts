import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create_book.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
