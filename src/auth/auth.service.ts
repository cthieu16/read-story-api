import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { AuthDto } from '../_dtos/auth.dto';
import { CreateUserDto } from '../_dtos/create_user.dto';
import { SigninResponse, SignupResponse } from '../_types/res.login.interface';
import { Tokens } from '../_types/tokens.type';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from 'src/_dtos/reset-password.dto';
import { ForgotPasswordDto } from 'src/_dtos/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<SignupResponse> {
    const userExists = await this.usersService.findByEmail(createUserDto.email);

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(String(newUser._id), newUser.email);
    await this.updateRefreshToken(String(newUser._id), tokens.refreshToken);
    return {
      ...tokens,
      name: newUser.name,
      email: newUser.email,
      _id: newUser._id.toString(),
    };
  }

  async signIn(data: AuthDto): Promise<SigninResponse> {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(String(user._id), user.email);
    await this.updateRefreshToken(String(user._id), tokens.refreshToken);
    return {
      data: {
        ...tokens,
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
    };
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { refreshToken: null });
    return {
      statusCode: HttpStatus.OK,
      message: 'Logged out successfully',
    };
  }

  async hashData(data: string) {
    return await argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, username: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<SignupResponse> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      name: user.name,
      email: user.email,
      _id: user._id.toString(),
    };
  }

  async getMe(userId: string): Promise<any> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      data: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        roles: user.roles,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        phoneNumber: user.phoneNumber,
        favorites: user.favorites,
      },
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ statusCode: number; message: string }> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatches = await argon2.verify(user.password, currentPassword);
    if (!passwordMatches) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await this.hashData(newPassword);

    await this.usersService.update(userId, { password: hashedNewPassword });

    return {
      statusCode: HttpStatus.OK,
      message: 'Password changed successfully',
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ statusCode: number; message: string }> {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) throw new NotFoundException('User does not exist');

    const resetToken = this.generateResetToken();
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 5);

    await this.usersService.update(user._id.toString(), {
      resetToken,
      resetTokenExpiration: expiration,
    });

    await this.mailService.sendResetPasswordEmail(user.email, resetToken);

    return {
      statusCode: HttpStatus.OK,
      message: 'Reset password email sent successfully',
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ statusCode: number; message: string }> {
    const user = await this.usersService.findByEmail(resetPasswordDto.email);
    if (!user) throw new NotFoundException('User does not exist');

    if (user.resetToken !== resetPasswordDto.token) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await this.hashData(resetPasswordDto.newPassword);
    await this.usersService.update(user._id.toString(), {
      password: hashedPassword,
      resetToken: null,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Password reset successfully',
    };
  }

  private generateResetToken(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }
}
