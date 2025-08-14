import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './product.entity';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import {
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { LocalAuthGuard } from 'src/auth/passport/local-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Return all products',
    type: [Product],
  })
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({ status: 200, description: 'Return a product', type: Product })
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'background', maxCount: 1 },
      ],
      {
        storage: require('multer').memoryStorage(),
        fileFilter: (req, file, cb) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
        },
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for processing
      },
    ),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
  ) {
    let imageUrls: string[] = [];
    let backgroundUrl: string | undefined;

    if (files?.images && files.images.length > 0) {
      imageUrls = await this.uploadService.uploadMultipleToCloudinary(
        files.images,
        'products',
      );
    }

    if (files?.background && files.background.length > 0) {
      const backgroundUrls =
        await this.uploadService.uploadMultipleToCloudinary(
          files.background,
          'products/backgrounds',
        );
      backgroundUrl = backgroundUrls[0];
    }

    // Parse JSON string arrays from FormData
    const processedDto = this.parseArrayFields(createProductDto);

    return this.productService.create({
      ...processedDto,
      images: imageUrls,
      background: backgroundUrl,
    });
  }

  private parseArrayFields(dto: any): CreateProductDto {
    const parseJsonArray = (field: any): string[] | undefined => {
      if (!field) return undefined;
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : undefined;
        } catch {
          return undefined;
        }
      }
      return undefined;
    };

    return {
      ...dto,
      features: parseJsonArray(dto.features),
      applications: parseJsonArray(dto.applications),
      ingredient: parseJsonArray(dto.ingredient),
      instructions: parseJsonArray(dto.instructions),
      highlights: parseJsonArray(dto.highlights),
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'background', maxCount: 1 },
      ],
      {
        storage: require('multer').memoryStorage(),
        fileFilter: (req, file, cb) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
        },
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for processing
      },
    ),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
  ) {
    let imageUrls: string[] | undefined;
    let backgroundUrl: string | undefined;

    if (files?.images && files.images.length > 0) {
      imageUrls = await this.uploadService.uploadMultipleToCloudinary(
        files.images,
        'products',
      );
    }

    if (files?.background && files.background.length > 0) {
      const backgroundUrls =
        await this.uploadService.uploadMultipleToCloudinary(
          files.background,
          'products/backgrounds',
        );
      backgroundUrl = backgroundUrls[0];
    }

    // Parse JSON string arrays from FormData
    const processedDto = this.parseArrayFields(updateProductDto);

    return this.productService.update(id, {
      ...processedDto,
      ...(imageUrls ? { images: imageUrls } : {}),
      ...(backgroundUrl ? { background: backgroundUrl } : {}),
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    type: Product,
  })
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
