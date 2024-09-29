import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { hassPasswordHelper } from 'src/util/helper';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }


  async isEmailExist(email: string) {
    try {
      const user = await this.userModel.exists({ email })
      if (user) return true
      return false
    } catch (error) {
    }
  }
  async create(data: CreateUserDto) {
    const { email, password, name } = data
    const checkEmail = await this.isEmailExist(email)
    if (checkEmail) {
      throw new BadRequestException(`Email đã tồn tại! Vui lòng sử dụng email khác: ${email}`);
    }
    const hassPassword = await hassPasswordHelper(password)
    const newUser = new this.userModel({ email, password: hassPassword, name });
    return newUser.save()
  }

  async findAll(data: any) {
    const { page, rowPage, filter } = data
    const skip = (+page - 1) * rowPage

    const userAll = await this.userModel.aggregate([
      // { $match: { isActive: true } },     
      {
        $facet: {
          data: [
            // { $sort: { age: -1 } },        
            { $skip: skip },                
            { $limit: +rowPage },           
            { $project: { name: 1, email: 1, password: 1 } } 
          ],
          total: [                          
            { $count: "total" }
          ]
        }
      }
    ]);
    const users = userAll[0].data;           
    const totalUsers = userAll[0].total[0]?.total || 0;

    return {
      data: users,
      totalUsers,
      currentPage: page
    }
  }

  async checkAccount(email: string) {
    try {
      const user = await this.userModel.findOne({ email })
      if (user) return user
      throw new BadRequestException("Email chưa được đăng ký vui lòng đăng ký tài khoản để đăng nhập")
    } catch (error) {
      console.log(error)
    }
  }

 async findByEmail(email:string) {
    return await this.userModel.findOne({email});
  }

  async update(id: string, data: UpdateUserDto) {
    const { name, email, password } = data
    let hashPass = password
    if (password) hashPass = await hassPasswordHelper(password)
    const user = await this.userModel.findByIdAndUpdate(id, { name, email, password: hashPass }, { new: true })
    return user
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
