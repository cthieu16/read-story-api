import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({ timestamps: true })
export class User {
  @Exclude()
  _id: mongoose.Types.ObjectId;

  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Exclude()
  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles: Role[];

  @Prop({ type: Date, nullable: true })
  dateOfBirth: Date | null;

  @Prop({ type: String, nullable: true })
  gender: string | null;

  @Prop({ type: String, nullable: true })
  address: string | null;

  @Prop({ type: String, nullable: true })
  phoneNumber: string | null;

  @Prop({ type: String, nullable: true })
  resetToken?: string;
  @Prop({ type: Date, nullable: true })
  resetTokenExpiration?: Date;

  @Exclude()
  @Prop()
  refreshToken: string;
  @Exclude()
  @Prop()
  refreshTokenExpiration: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }] })
  favorites: mongoose.Types.ObjectId[];

  constructor(partial: Partial<User>) {
    partial.id = partial._id.toString();
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
