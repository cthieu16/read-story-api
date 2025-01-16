import { NotFoundException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../_dtos/create_user.dto';
import { UpdateUserDto } from '../_dtos/update_user.dto';
import { User, UserDocument } from '../_schemas/user.schema';
import { CollectionDto } from 'src/_dtos/input.dto';
import { CollectionResponse } from 'src/_dtos/output.dto';
import { DocumentCollector } from 'src/common/executor/collector';
import { UpdateProfileDto } from 'src/_dtos/update_profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(
    collectionDto: CollectionDto,
  ): Promise<CollectionResponse<UserDocument>> {
    try {
      const collector = new DocumentCollector<UserDocument>(this.userModel);
      return collector.find(collectionDto);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id).lean().exec();

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ email }).lean().exec();

      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const createdUser = new this.userModel(createUserDto);

      return await createdUser.save();
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ statusCode: number; message: string; data: User }> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, {
          new: true,
          runValidators: true,
        })
        .lean()
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<UserDocument> {
    try {
      const deletedUser = await this.userModel
        .findByIdAndDelete(id)
        .lean()
        .exec();

      if (!deletedUser) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return deletedUser;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<{ statusCode: number; message: string; data: User }> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $set: {
              name: updateProfileDto.name,
              dateOfBirth: updateProfileDto.dateOfBirth,
              gender: updateProfileDto.gender,
              address: updateProfileDto.address,
              phoneNumber: updateProfileDto.phoneNumber,
            },
          },
          {
            new: true,
            runValidators: true,
          },
        )
        .lean()
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Profile updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async markAsFavorite(
    userId: string,
    episodeId: string,
  ): Promise<{ statusCode: number; message: string }> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          userId,
          { $addToSet: { favorites: episodeId } },
          { new: true, runValidators: true },
        )
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Episode added to favorites successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async unmarkAsFavorite(
    userId: string,
    episodeId: string,
  ): Promise<{ statusCode: number; message: string }> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          userId,
          { $pull: { favorites: episodeId } },
          { new: true, runValidators: true },
        )
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Episode removed from favorites successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findEpisodesFavoriteByMe(id: string): Promise<UserDocument> {
    try {
      const episodesByMe = await this.userModel
        .findById(id)
        .populate({
          path: 'favorites',
          populate: {
            path: 'chapterId',
            select: '_id',
            populate: { path: 'bookId', select: 'author' },
          },
        })
        .select('favorites')
        .lean()
        .exec();

      if (!episodesByMe) {
        throw new NotFoundException(`Episodes by me with id ${id} not found`);
      }

      return episodesByMe;
    } catch (error) {
      throw error;
    }
  }
}
