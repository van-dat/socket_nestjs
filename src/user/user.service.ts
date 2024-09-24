import { BadRequestException, Body, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { hassPasswordHelper } from 'src/util/helper';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  async create(data: CreateUserDto) {
    try {
      const { email, password, name } = data
      const hassPassword = await hassPasswordHelper(password)
      const newUser = new this.userModel({ email, password: hassPassword, name });
      return newUser.save()
    } catch (error) {
      throw new BadRequestException
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
