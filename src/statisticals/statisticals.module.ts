import { Module } from '@nestjs/common';
import { StatisticalsService } from './statisticals.service';
import { StatisticalsController } from './statisticals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/_schemas/user.schema';
import { Episode, EpisodeSchema } from 'src/_schemas/episode.schema';
import { Chapter, ChapterSchema } from 'src/_schemas/chapter.schema';
import { Book, BookSchema } from 'src/_schemas/book.schema';
import { Category, CategorySchema } from 'src/_schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
      MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
      MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
      MongooseModule.forFeature([{ name: Episode.name, schema: EpisodeSchema }]),
    ],
  controllers: [StatisticalsController],
  providers: [StatisticalsService],
})
export class StatisticalsModule {}
