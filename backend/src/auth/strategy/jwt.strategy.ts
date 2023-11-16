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
    console.log('cookieExtractor init');
  }

  private static cookieExtractor(req: RequestType): string | null {
		const accessToken = req.cookies?.user_token;
		console.log('token extracted from cookie', accessToken);
		//if null return to login page
		return accessToken;
	  }

  async validate(payload:any) {
    console.log('validation technique called');
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    // console.log(user);
    if (!user) {
      return null;
    }
    console.log('User found in validation');
    // else if (user.password !== password) {return null;}
    return user;
  }
}
