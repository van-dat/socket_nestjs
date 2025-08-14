import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  fullName?: string;

  @Prop()
  subtitle?: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  image_products: string[];

  @Prop({ required: true })
  category: string;

  @Prop()
  sku?: string;

  @Prop()
  weight?: string;

  @Prop()
  standard?: string;

  @Prop({ type: [String], default: [] })
  highlights?: string[];

  @Prop({ type: [String], default: [] })
  features?: string[];

  @Prop({ type: [String], default: [] })
  applications?: string[];

  @Prop({ type: [String], default: [] })
  ingredients?: string[];

  @Prop({ type: [String], default: [] })
  instructions?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
