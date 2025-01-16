import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from '../common/decorator/decorator.auth_user';
import { AccessTokenGuard } from '../common/gaurds/gaurd.access_token';
import { RefreshTokenGuard } from '../common/gaurds/gaurd.refresh_token';
import { AuthDto } from '../_dtos/auth.dto';
import { CreateUserDto } from '../_dtos/create_user.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from 'src/_dtos/change_password.dto';
import { ForgotPasswordDto } from 'src/_dtos/forgot-password.dto';
import { ResetPasswordDto } from 'src/_dtos/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@AuthUser('sub') userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(
    @AuthUser('sub') userId: string,
    @AuthUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @Get('me')
  getMe(@AuthUser('sub') userId: string) {
    return this.authService.getMe(userId);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @Patch('change-password')
  changePassword(
    @AuthUser('sub') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
