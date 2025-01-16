import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Exclude } from 'class-transformer';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Exclude()
  _id: mongoose.Types.ObjectId;

  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  url: string;

  constructor(partial: Partial<Category>) {
    partial.id = partial._id.toString();
    Object.assign(this, partial);
  }
}

export const CategorySchema = SchemaFactory.createForClass(Category);
