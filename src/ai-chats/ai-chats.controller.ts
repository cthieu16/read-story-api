import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiChatsService } from './ai-chats.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/gaurds/gaurd.access_token';

@ApiTags('AI Chats')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard)
@Controller('ai-chats')
export class AiChatsController {
  constructor(private readonly aiChatsService: AiChatsService) {}

  @Post('generate')
  async generateContent(@Body('prompt') prompt: string) {
    return this.aiChatsService.generateContent(prompt);
  }
}
