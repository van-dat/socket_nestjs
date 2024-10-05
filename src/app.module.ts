import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { EventGateway } from './event/event.gateway';
import { AModule } from './a/a.module';

@Module({
  imports: [AuthModule, UserModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    AModule
  ],
  providers : [ {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },EventGateway ]
})
export class AppModule {}
