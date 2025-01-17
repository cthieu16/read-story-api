import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AccessTokenGuard } from 'src/common/gaurds/gaurd.access_token';

@ApiTags('Uploads')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }
}
