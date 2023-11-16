import { Injectable, NestMiddleware } from '@nestjs/common';
import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import * as passport from 'passport';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
	console.log('JwtAuthMiddleware called');
    passport.authenticate('jwt', { session: false }, (err: any, user: User) => {
	if (user) {
		console.log('JwtAuthMiddleware user', user);
        req.user = user;
      }
	  console.log('JwtAuthMiddleware next');
      next();
    })(req, res, next);
  }
}
