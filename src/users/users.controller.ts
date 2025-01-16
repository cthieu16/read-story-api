import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../common/gaurds/gaurd.access_token';
import { CreateUserDto } from '../_dtos/create_user.dto';
import { UpdateUserDto } from '../_dtos/update_user.dto';
import { Role, User } from '../_schemas/user.schema';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CollectionDto } from 'src/_dtos/input.dto';
import { UpdateProfileDto } from 'src/_dtos/update_profile.dto';
import { AuthUser } from 'src/common/decorator/decorator.auth_user';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/gaurds/guard.roles';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll(@Query() query: CollectionDto): Promise<{ data: User[] }> {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch('update-profile/by-me')
  updateProfile(
    @AuthUser('sub') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Patch('favorite/episode/:episodeId')
  markAsFavorite(
    @AuthUser('sub') userId: string,
    @Param('episodeId') episodeId: string,
  ): Promise<{ statusCode: number; message: string }> {
    return this.usersService.markAsFavorite(userId, episodeId);
  }

  @Patch('unmark-favorite/episode/:episodeId')
  async unmarkAsFavorite(
    @AuthUser('sub') userId: string,
    @Param('episodeId') episodeId: string,
  ): Promise<{ statusCode: number; message: string }> {
    return this.usersService.unmarkAsFavorite(userId, episodeId);
  }

  @Get('episodes/by-me')
  findEpisodesFavoriteByMe(@AuthUser('sub') userId: string) {
    return this.usersService.findEpisodesFavoriteByMe(userId);
  }
}
