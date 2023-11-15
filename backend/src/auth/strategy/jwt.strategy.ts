import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  private static cookieExtractor(req: RequestType): string | null {
    console.log('test');
    return req.cookies?.access_token ?? null;
  }

  async validate(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email,},
    });
    // console.log(user);
    // if (!user) {return null;}
    // else if (user.password !== password) {return null;}
    return user;
  }
}
