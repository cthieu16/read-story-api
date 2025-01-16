import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
  private readonly defaultFolder = 'Story';

  private async uploadFileToDefaultFolder(
    file: Express.Multer.File,
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: this.defaultFolder, resource_type: resourceType },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<CloudinaryResponse> {
    return this.uploadFileToDefaultFolder(file, resourceType);
  }

  async bulkDelete(publicIds: string[]): Promise<any[]> {
    const deletePromises = publicIds.map(async (publicId) => {
      const fullPublicId = `${this.defaultFolder}/${publicId}`;
      try {
        const result = await cloudinary.uploader.destroy(fullPublicId, {
          invalidate: true,
        });
        return { publicId: fullPublicId, result };
      } catch (error) {
        console.error(`Failed to delete ${fullPublicId}:`, error);
        return { publicId: fullPublicId, error };
      }
    });

    return Promise.all(deletePromises);
  }

  extractPublicId(imageUrl: string): string {
    const urlParts = imageUrl.split('/');
    const lastPart = urlParts.pop();
    return lastPart ? lastPart.split('.')[0] : '';
  }
}
