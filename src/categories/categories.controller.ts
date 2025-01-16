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
import { CreateCategoryDto } from 'src/_dtos/create_category.dto';
import { CollectionDto } from 'src/_dtos/input.dto';
import { UpdateCategoryDto } from 'src/_dtos/update_category.dto';
import { Category } from 'src/_schemas/category.schema';
import { AccessTokenGuard } from 'src/common/gaurds/gaurd.access_token';
import { CategoriesService } from './categories.service';
import { CategoryPaginationDto } from 'src/_dtos/category-pagination.dto';

@ApiTags('Categories')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(@Query() query: CollectionDto): Promise<{ data: Category[] }> {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Get('value-labels/category')
  async getCategoryValueLabels() {
    const valueLabels = await this.categoriesService.getCategoryValueLabels();
    return valueLabels;
  }

  @Get('all/no-pagination')
  async findAllNoPagination(): Promise<{ data: Category[] }> {
    return this.categoriesService.findAllNoPagination();
  }

  @Get('all/pagination')
  async findAllPagination(@Query() dto: CategoryPaginationDto) {
    return this.categoriesService.findAllPagination(dto);
  }
}
