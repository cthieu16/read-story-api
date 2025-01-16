import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from 'src/_schemas/book.schema';
import { Category, CategoryDocument } from 'src/_schemas/category.schema';
import { Chapter, ChapterDocument } from 'src/_schemas/chapter.schema';
import { Episode, EpisodeDocument } from 'src/_schemas/episode.schema';
import { User, UserDocument } from 'src/_schemas/user.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
    @InjectModel(Chapter.name)
    private readonly chapterModel: Model<ChapterDocument>,
    @InjectModel(Episode.name)
    private readonly episodeModel: Model<EpisodeDocument>,
  ) {}

  async getStatistics(): Promise<Record<string, number>> {
    const [userCount, categoryCount, bookCount, chapterCount, episodeCount] =
      await Promise.all([
        this.userModel.countDocuments().exec(),
        this.categoryModel.countDocuments().exec(),
        this.bookModel.countDocuments().exec(),
        this.chapterModel.countDocuments().exec(),
        this.episodeModel.countDocuments().exec(),
      ]);

    return {
      userCount,
      categoryCount,
      bookCount,
      chapterCount,
      episodeCount,
    };
  }
}
