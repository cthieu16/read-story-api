import { Module } from '@nestjs/common';
import { AiChatsService } from './ai-chats.service';
import { AiChatsController } from './ai-chats.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AiChatsController],
  providers: [AiChatsService],
})
export class AiChatsModule {}
