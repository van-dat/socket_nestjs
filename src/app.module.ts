import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SocketsModule } from './sockets/sockets.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [AuthModule, UserModule, SocketsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    })
  ],
})
export class AppModule {}
