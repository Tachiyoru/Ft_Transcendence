import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
	PassportModule.register({ defaultStrategy: 'jwt', session: false }),
	JwtModule.register({signOptions: { expiresIn: '3h' }})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
