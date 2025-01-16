import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterDto } from './create_chapter.dto';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {}
