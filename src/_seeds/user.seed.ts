import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { Role, User, UserDocument } from 'src/_schemas/user.schema';

@Injectable()
export class UserSeed {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async seed() {
    const users = [
      {
        name: 'admin',
        email: 'admin@gmail.com',
        password: await argon2.hash('admin@123'),
        roles: [Role.ADMIN],
      },
      {
        name: 'user',
        email: 'user@gmail.com',
        password: await argon2.hash('admin@123'),
        roles: [Role.USER],
      },
    ];

    for (const user of users) {
      const existingUser = await this.userModel.findOne({ email: user.email });
      if (!existingUser) {
        await this.userModel.create(user);
        console.log(`Created user: ${user.email}`);
      } else {
        console.log(`User already exists: ${user.email}`);
      }
    }
  }
}
