import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryPaginationDto } from 'src/_dtos/category-pagination.dto';
import { CreateCategoryDto } from 'src/_dtos/create_category.dto';
import { CollectionDto } from 'src/_dtos/input.dto';
import { CollectionResponse } from 'src/_dtos/output.dto';
import { UpdateCategoryDto } from 'src/_dtos/update_category.dto';
import { Book, BookDocument } from 'src/_schemas/book.schema';
import { Category, CategoryDocument } from 'src/_schemas/category.schema';
import { DocumentCollector } from 'src/common/executor/collector';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Book.name)
    private readonly bookModel: Model<BookDocument>,
  ) {}

  async findAll(
    collectionDto: CollectionDto,
  ): Promise<CollectionResponse<CategoryDocument>> {
    try {
      const collector = new DocumentCollector<CategoryDocument>(
        this.categoryModel,
      );
      return collector.find(collectionDto);
    } catch (error) {
      throw error;
    }
  }

  async findAllPagination(dto: CategoryPaginationDto): Promise<any> {
    const { page = 1, limit = 10, ...filters } = dto;

    const skip = (page - 1) * limit;

    const filter: any = {};

    if (filters.name) {
      filter.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.url) {
      filter.url = { $regex: filters.url, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      this.categoryModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 })
        .exec(),
      this.categoryModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      total,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit),
      data,
    };
  }

  async findAllNoPagination(): Promise<{
    statusCode: number;
    data: Category[];
  }> {
    const categories = await this.categoryModel.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'books',
        },
      },
      {
        $match: {
          books: { $ne: [] },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
          url: 1,
        },
      },
    ]);

    return {
      statusCode: HttpStatus.OK,
      data: categories,
    };
  }

  async findById(id: string): Promise<{ statusCode: number; data: Category }> {
    try {
      const category = await this.categoryModel.findById(id).lean().exec();

      if (!category) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }

      const books = await this.bookModel.find({ categoryId: id }).lean().exec();

      const result = {
        ...category,
        books,
      };

      return { statusCode: HttpStatus.OK, data: result };
    } catch (error) {
      throw error;
    }
  }

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ statusCode: number; message: string; data: Category }> {
    try {
      const categoryData = { ...createCategoryDto };
      const data = await this.categoryModel.create(categoryData);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Created successfully',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ statusCode: number; message: string; data: Category }> {
    try {
      const currentCategory = await this.categoryModel.findById(id).exec();
      if (!currentCategory) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }

      const updatedData = { ...updateCategoryDto };

      const data = await this.categoryModel
        .findByIdAndUpdate(id, updatedData, {
          new: true,
          runValidators: true,
        })
        .lean()
        .exec();

      if (!data) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<{ statusCode: number; message: string }> {
    try {
      const category = await this.categoryModel.findById(id).exec();

      if (!category) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }

      await this.categoryModel.findByIdAndDelete(id).exec();

      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getCategoryValueLabels(): Promise<{ label: string; value: string }[]> {
    try {
      const categories = await this.categoryModel.find().lean();
      return categories.map((category) => ({
        label: category.name,
        value: category._id.toString(),
      }));
    } catch (error) {
      throw error;
    }
  }
}
