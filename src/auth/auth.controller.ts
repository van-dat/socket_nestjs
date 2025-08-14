import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Req,
  Res,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from 'src/util/constants';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('google')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return;
  }

  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res) {
    const result = await this.authService.login(req.user);
    // Redirect back to frontend with token as query, or return JSON if no redirect configured
    const redirectUrl = process.env.GOOGLE_LOGIN_REDIRECT_URL;
    if (redirectUrl) {
      const url = new URL(redirectUrl);
      url.searchParams.set('token', result.access_token);
      return res.redirect(url.toString());
    }
    return res.json(result);
  }

  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      console.log(createUserDto);
      const user = await this.authService.register(createUserDto);
      return this.authService.login(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
