import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from 'src/_schemas/category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Book, BookSchema } from 'src/_schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Book.name, schema: BookSchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CloudinaryService],
})
export class CategoriesModule {}
