import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { checkPass } from 'src/util/helper';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async checkAccount(email: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (user) return user;
      throw new UnauthorizedException('User not found');
    } catch (error) {
      throw new UnauthorizedException('Error while fetching user');
    }
  }

  async login(user: any) {
    const payload = {
      username: user.name,
      sub: user._id,
      email: user.email,
      roles: user.roles,
      codeId: user.codeId,
    };
    return {
      data: user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.checkAccount(email);
    const check = await checkPass(password, user.password);
    if (!user || !check) return null;
    return user;
  }

  async register(createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
