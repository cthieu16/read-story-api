import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateChapterDto } from 'src/_dtos/create_chapter.dto';
import { CollectionDto } from 'src/_dtos/input.dto';
import { UpdateChapterDto } from 'src/_dtos/update_chapter.dto';
import { Chapter } from 'src/_schemas/chapter.schema';
import { AccessTokenGuard } from 'src/common/gaurds/gaurd.access_token';
import { ChaptersService } from './chapters.service';
import { ChapterPaginationDto } from 'src/_dtos/chapter-pagination.dto';

@ApiTags('Chapters')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard)
@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get()
  async findAll(@Query() query: CollectionDto): Promise<{ data: Chapter[] }> {
    return this.chaptersService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.chaptersService.findById(id);
  }

  @Post()
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chaptersService.create(createChapterDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chaptersService.update(id, updateChapterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chaptersService.remove(id);
  }

  @Get('value-labels/chapter')
  async getChapterValueLabels() {
    const valueLabels = await this.chaptersService.getChapterValueLabels();
    return valueLabels;
  }

  @Get('book/:bookId')
  async findByBookId(@Param('bookId') bookId: string) {
    return this.chaptersService.findByBookId(bookId);
  }

  @Get('book/:bookId/chapter/:currentChapterId/prev/auto-click')
  async findPrevChapterAutoClick(
    @Param('bookId') bookId: string,
    @Param('currentChapterId') currentChapterId: string,
  ) {
    return this.chaptersService.findPrevChapter(bookId, currentChapterId);
  }

  @Get('book/:bookId/chapter/:currentChapterId/next/auto-click')
  async findNextChapterAutoClick(
    @Param('bookId') bookId: string,
    @Param('currentChapterId') currentChapterId: string,
  ) {
    return this.chaptersService.findNextChapter(bookId, currentChapterId);
  }

  @Post('book/:bookId/chapter/:currentChapterId/prev/click')
  async findPrevChapterClick(
    @Param('bookId') bookId: string,
    @Param('currentChapterId') currentChapterId: string,
  ) {
    return this.chaptersService.findPrevChapter(bookId, currentChapterId);
  }

  @Post('book/:bookId/chapter/:currentChapterId/next/click')
  async findNextChapterClick(
    @Param('bookId') bookId: string,
    @Param('currentChapterId') currentChapterId: string,
  ) {
    return this.chaptersService.findNextChapter(bookId, currentChapterId);
  }

  @Get('all/pagination')
  async findAllPagination(@Query() dto: ChapterPaginationDto) {
    return this.chaptersService.findAllPagination(dto);
  }
}
