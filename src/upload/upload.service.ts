import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  getMulterConfig(destination: string) {
    return {
      storage: diskStorage({
        destination: `./uploads/${destination}`,
        filename: (req, file, callback) => {
          const uniqueSuffix = uuidv4();
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    };
  }

  async uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    try {
      const webpBuffer = await sharp(file.buffer)
        .webp({ quality: 80, effort: 6 })
        .toBuffer();

      const result = await cloudinary.uploader.upload(
        `data:image/webp;base64,${webpBuffer.toString('base64')}`,
        {
          folder: 'hpm_cement_uploads',
          public_id: uuidv4(),
          format: 'webp',
          transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
        },
      );

      return result.secure_url;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  async uploadMultipleToCloudinary(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<string[]> {
    const uploadPromises = files.map((file) =>
      this.uploadToCloudinary(file, folder),
    );
    return Promise.all(uploadPromises);
  }

  getMemoryStorageConfig() {
    return {
      storage: {
        dest: 'memory',
      } as any,
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    };
  }
}
