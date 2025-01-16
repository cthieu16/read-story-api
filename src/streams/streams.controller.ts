import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { StreamsService } from './streams.service';

@ApiTags('Streams')
@Controller('streams')
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @Get('audio')
  async streamPreviewAudio(@Query('path') path: string, @Res() res: Response) {
    await this.streamsService.streamPreviewAudio(path, res.req.headers, res);
  }

  @Get('image')
  async streamPreviewImage(@Query('path') path: string, @Res() res: Response) {
    await this.streamsService.streamPreviewImage(path, res.req.headers, res);
  }
}
