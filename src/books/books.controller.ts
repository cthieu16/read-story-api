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
import { AccessTokenGuard } from 'src/common/gaurds/gaurd.access_token';
import { CreateBookDto } from '../_dtos/create_book.dto';
import { CollectionDto } from '../_dtos/input.dto';
import { UpdateBookDto } from '../_dtos/update_book.dto';
import { Book } from '../_schemas/book.schema';
import { BooksService } from './books.service';
import { BookPaginationDto } from 'src/_dtos/book-pagination.dto';

@ApiTags('Books')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll(@Query() query: CollectionDto): Promise<{ data: Book[] }> {
    return this.booksService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.booksService.findById(id);
  }

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }

  @Get('value-labels/book')
  async getBookValueLabels() {
    const valueLabels = await this.booksService.getBookValueLabels();
    return valueLabels;
  }

  @Patch(':id/update/is-top-10-year')
  async updateIsTop10Year(@Param('id') id: string) {
    return this.booksService.updateIsTop10Year(id);
  }

  @Get('get/all-top-10-year')
  async findAllTop10Year(): Promise<{ data: Book[] }> {
    return this.booksService.findAllTop10Year();
  }

  @Get('all/no-pagination')
  async findAllNoPagination(
    @Query('name') name?: string,
  ): Promise<{ statusCode: number; data: Book[] }> {
    return this.booksService.findAllNoPagination(name);
  }

  @Get('all/pagination')
  async findAllPagination(@Query() dto: BookPaginationDto) {
    return this.booksService.findAllPagination(dto);
  }
}
