import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  fullName?: string;

  @ApiProperty({ required: false })
  subtitle?: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: false })
  background?: string;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  category: string;

  @ApiProperty()
  inStock: boolean;

  @ApiProperty({ required: false })
  sku?: string;

  @ApiProperty({ required: false })
  weight?: string;

  @ApiProperty({ required: false })
  standard?: string;

  @ApiProperty({ type: [String], required: false })
  features?: string[];

  @ApiProperty({ type: [String], required: false })
  applications?: string[];

  @ApiProperty({ type: [String], required: false })
  ingredient?: string[];

  @ApiProperty({ type: [String], required: false })
  instructions?: string[];

  @ApiProperty({ type: [String], required: false })
  highlights?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
