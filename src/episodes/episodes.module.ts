import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Episode, EpisodeSchema } from '../_schemas/episode.schema';
import { User, UserSchema } from '../_schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { Chapter, ChapterSchema } from 'src/_schemas/chapter.schema';
import { Book, BookSchema } from 'src/_schemas/book.schema';
import { ChaptersService } from 'src/chapters/chapters.service';
import { BooksService } from 'src/books/books.service';

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
    CloudinaryService,
    ConfigService,
    ChaptersService,
    BooksService,
  ],
  exports: [EpisodesService, UsersService],
})
export class EpisodesModule {}
