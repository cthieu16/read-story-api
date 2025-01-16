import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
  /**
   * Uploads a file to a specific folder in Cloudinary.
   * @param file The file to be uploaded.
   * @param folder The folder in which to upload the file.
   * @param resourceType The type of resource ('image', 'video', or 'raw' for audio).
   * @returns A promise that resolves with the Cloudinary response.
   */
  private async uploadFileToFolder(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Uploads a file to Cloudinary.
   * @param file The file to be uploaded.
   * @param folder The folder in which to upload the file.
   * @param resourceType The type of resource ('image', 'video', or 'raw' for audio).
   * @returns A promise that resolves with the Cloudinary response.
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<CloudinaryResponse> {
    return this.uploadFileToFolder(file, folder, resourceType);
  }

  /**
   * Uploads an image for a book to Cloudinary.
   * @param file The image file to be uploaded.
   * @returns A promise that resolves with the Cloudinary response.
   */
  uploadImageCategory(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return this.uploadFile(file, 'podcast/category');
  }

  /**
   * Uploads an image for a book to Cloudinary.
   * @param file The image file to be uploaded.
   * @returns A promise that resolves with the Cloudinary response.
   */
  uploadImageBook(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return this.uploadFile(file, 'podcast/book');
  }

  /**
   * Uploads an image for a chapter to Cloudinary.
   * @param file The image file to be uploaded.
   * @returns A promise that resolves with the Cloudinary response.
   */
  uploadImageChapter(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return this.uploadFile(file, 'podcast/chapter');
  }

  /**
   * Uploads an image for episodes to Cloudinary.
   * @param file The image file to be uploaded.
   * @returns A promise that resolves with the Cloudinary response.
   */
  uploadImageEpisodes(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return this.uploadFile(file, 'podcast/episodes');
  }

  /**
   * Uploads a video to Cloudinary.
   * @param file The video file to be uploaded.
   * @returns A promise that resolves with the Cloudinary response.
   */
  uploadVideo(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return this.uploadFile(file, 'podcast/video', 'video');
  }

  /**
   * Uploads an audio file to Cloudinary.
   * @param file The audio file to be uploaded.
   * @returns A promise that resolves with the Cloudinary response.
   */
  uploadAudio(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return this.uploadFile(file, 'podcast/audio', 'raw');
  }

  /**
   * Deletes multiple files from Cloudinary.
   * @param publicIds An array of public IDs to be deleted.
   * @param folder The folder containing the files.
   * @returns A promise that resolves with an array of deletion results.
   */
  async bulkDelete(publicIds: string[], folder: string): Promise<any[]> {
    const deletePromises = publicIds.map(async (publicId) => {
      const fullPublicId = `${folder}/${publicId}`;
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

  /**
   * Extracts the public ID from a Cloudinary image URL.
   * @param imageUrl The URL of the image.
   * @returns The public ID extracted from the URL.
   */
  extractPublicId(imageUrl: string): string {
    const urlParts = imageUrl.split('/');
    const lastPart = urlParts.pop();
    return lastPart ? lastPart.split('.')[0] : '';
  }
}
