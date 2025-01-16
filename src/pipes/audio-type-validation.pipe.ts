import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AudioTypeValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File) {
    try {
      const { mimetype } = value;

      if (!mimetype.includes('audio')) {
        fs.unlink(value.path, (err) => {
          if (err) {
            console.log('error in deleting a file from uploads');
          } else {
            console.log('succesfully deleted from the uploads folder');
          }
        });
        throw new BadRequestException('Only upload audio');
      }

      return value;
    } catch (error) {
      throw error;
    }
  }
}
