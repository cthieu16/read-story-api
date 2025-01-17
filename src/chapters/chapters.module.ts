import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from 'src/_schemas/book.schema';
import { BooksService } from 'src/books/books.service';
import { Chapter, ChapterSchema } from '../_schemas/chapter.schema';
import { User, UserSchema } from '../_schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    UsersModule,
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService, UsersService, BooksService],
  exports: [ChaptersService],
})
export class ChaptersModule {}
