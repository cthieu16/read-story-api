import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChapterPaginationDto } from 'src/_dtos/chapter-pagination.dto';
import { CreateChapterDto } from 'src/_dtos/create_chapter.dto';
import { UpdateChapterDto } from 'src/_dtos/update_chapter.dto';
import { Book, BookDocument } from 'src/_schemas/book.schema';
import { CollectionDto } from '../_dtos/input.dto';
import { CollectionResponse } from '../_dtos/output.dto';
import { Chapter, ChapterDocument } from '../_schemas/chapter.schema';
import { DocumentCollector } from '../common/executor/collector';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel(Chapter.name)
    private readonly chapterModel: Model<ChapterDocument>,
    @InjectModel(Book.name)
    private readonly bookModel: Model<BookDocument>,
  ) {}

  async findAll(
    collectionDto: CollectionDto,
  ): Promise<CollectionResponse<ChapterDocument>> {
    try {
      const collector = new DocumentCollector<ChapterDocument>(
        this.chapterModel,
      );
      return collector.find(collectionDto);
    } catch (error) {
      throw error;
    }
  }

  async findAllPagination(dto: ChapterPaginationDto): Promise<any> {
    const { page = 1, limit = 10, ...filters } = dto;

    const skip = (page - 1) * limit;

    const filter: any = {};

    if (filters.name) {
      filter.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.description) {
      filter.description = { $regex: filters.description, $options: 'i' };
    }

    if (filters.isPremium !== undefined) {
      filter.isPremium = filters.isPremium;
    }

    if (filters.bookId) {
      filter.bookId = { $regex: filters.bookId, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      this.chapterModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 })
        .exec(),
      this.chapterModel.countDocuments(filter).exec(),
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

  async findById(id: string): Promise<{ statusCode: number; data: Chapter }> {
    try {
      const chapter = await this.chapterModel.findById(id).lean().exec();

      if (!chapter) {
        throw new NotFoundException(`Chapter with id ${id} not found`);
      }

      return { statusCode: HttpStatus.OK, data: chapter };
    } catch (error) {
      throw error;
    }
  }

  async create(
    createChapterDto: CreateChapterDto,
  ): Promise<{ statusCode: number; message: string; data: Chapter }> {
    try {
      const chapterData = { ...createChapterDto };
      const data = await this.chapterModel.create(chapterData);

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
    updateChapterDto: UpdateChapterDto,
  ): Promise<{ statusCode: number; message: string; data: Chapter }> {
    try {
      const currentChapter = await this.chapterModel.findById(id).exec();
      if (!currentChapter) {
        throw new NotFoundException(`Chapter with id ${id} not found`);
      }

      const updatedData = { ...updateChapterDto };

      const data = await this.chapterModel
        .findByIdAndUpdate(id, updatedData, {
          new: true,
          runValidators: true,
        })
        .lean()
        .exec();

      if (!data) {
        throw new NotFoundException(`Chapter with id ${id} not found`);
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
      const chapter = await this.chapterModel.findById(id).exec();

      if (!chapter) {
        throw new NotFoundException(`Chapter with id ${id} not found`);
      }

      await this.chapterModel.findByIdAndDelete(id).exec();

      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getChapterValueLabels(): Promise<{ label: string; value: string }[]> {
    try {
      const chapters = await this.chapterModel.find().lean();
      return chapters.map((chapter) => ({
        label: chapter.name,
        value: chapter._id.toString(),
      }));
    } catch (error) {
      throw error;
    }
  }

  async findByBookId(bookId: string): Promise<{
    statusCode: number;
    data: { book: Book; chapters: Chapter[] };
  }> {
    try {
      const book = await this.bookModel.findById(bookId).lean().exec();

      if (!book) {
        throw new NotFoundException(`Book with id ${bookId} not found`);
      }

      const chapters = await this.chapterModel
        .find({ bookId })
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      return {
        statusCode: HttpStatus.OK,
        data: {
          book,
          chapters,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
