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
  ): Promise<{ secure_url: string }> {
    if (!file) {
      throw new Error('No file provided for upload.');
    }

    return new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: this.defaultFolder, resource_type: resourceType },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          if (result && result.secure_url) {
            resolve({ secure_url: result.secure_url });
          } else {
            reject(new Error('Upload successful but secure_url is missing.'));
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<any> {
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
