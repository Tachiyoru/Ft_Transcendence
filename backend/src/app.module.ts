import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), MulterModule.register({
	dest: './uploads'}), UserModule, AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}