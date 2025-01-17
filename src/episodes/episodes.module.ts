import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from 'src/_schemas/book.schema';
import { Chapter, ChapterSchema } from 'src/_schemas/chapter.schema';
import { BooksService } from 'src/books/books.service';
import { ChaptersService } from 'src/chapters/chapters.service';
import { UsersService } from 'src/users/users.service';
import { Episode, EpisodeSchema } from '../_schemas/episode.schema';
import { User, UserSchema } from '../_schemas/user.schema';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Episode.name, schema: EpisodeSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [EpisodesController],
  providers: [
    EpisodesService,
    UsersService,
    ConfigService,
    ChaptersService,
    BooksService,
  ],
  exports: [EpisodesService, UsersService],
})
export class EpisodesModule {}
