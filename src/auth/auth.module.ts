import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { AuthGuard } from './auth.guard';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    ConfigModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule here as well
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('SECRET_KEY'), // 'secretOrPrivateKe i,s deprecated, use 'secret'
        signOptions: {
          expiresIn: configService.get<string>('SECRET_KEY_EXPIRESIN'),
        },
      }),
      inject: [ConfigService],

    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy ],
})
export class AuthModule {}
