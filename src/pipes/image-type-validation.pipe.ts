import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class ImageTypeValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File) {
    try {
      const { mimetype } = value;

      if (!mimetype.includes('image')) {
        await fs.unlink(value.path, (err) => {
          if (err) {
            console.log('error in deleting a file from uploads');
          } else {
            console.log('succesfully deleted from the uploads folder');
          }
        });

        throw new BadRequestException(
          'The image should be either jpeg, png, or webp.',
        );
      }

      return value;
    } catch (error) {
      throw error;
    }
  }
}
