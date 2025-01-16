import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { ChaptersModule } from './chapters/chapters.module';
import { EpisodesModule } from './episodes/episodes.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadsModule } from './uploads/uploads.module';
import { StreamsModule } from './streams/streams.module';
import { IAPModule } from '@jeremybarbet/nest-iap';
import { IapModule } from './iap/iap.module';
import { StatisticalsModule } from './statisticals/statisticals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    AuthModule,
    BooksModule,
    ChaptersModule,
    EpisodesModule,
    CloudinaryModule,
    CategoriesModule,
    UploadsModule,
    StreamsModule,
    IapModule,
    StatisticalsModule,
  ],
})
export class AppModule {}
