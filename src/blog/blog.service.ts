import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async findAll(): Promise<Blog[]> {
    return this.blogModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Blog> {
    return this.blogModel.findById(id).exec();
  }

  async create(data: CreateBlogDto): Promise<Blog> {
    const createdBlog = new this.blogModel(data);
    return createdBlog.save();
  }

  async update(id: string, data: UpdateBlogDto): Promise<Blog> {
    return this.blogModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<Blog> {
    return this.blogModel.findByIdAndDelete(id).exec();
  }

  async findByTag(tag: string): Promise<Blog[]> {
    return this.blogModel.find({ tags: tag }).sort({ createdAt: -1 }).exec();
  }
}
