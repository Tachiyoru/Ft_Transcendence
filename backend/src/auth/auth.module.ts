import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthMiddleware } from './strategy/jwt-auth.middleware';
import { FortyTwoStrategy } from './strategy/42.strategy';
import { GithubStrategy } from './strategy/github.strategy';
import { TwoFaController } from './twoFA/two-fa/two-fa.controller';
import { TwoFaService } from './twoFA/two-fa/two-fa.service';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({ secret: 'feur', signOptions: { expiresIn: '3h' } }),
	],
	controllers: [AuthController, TwoFaController],
	providers: [AuthService, JwtStrategy, FortyTwoStrategy, GithubStrategy, TwoFaService],
})

export class AuthModule implements NestModule
{
	configure(consumer: MiddlewareConsumer)
	{
		consumer
			.apply(JwtAuthMiddleware)
			.exclude('/auth/signup', '/auth/signin', 'auth/42', 'auth/42/callback', '/auth/github', '/auth/github/callback')
			.forRoutes('*');
		console.log('JwtAuthMiddleware applied');
	}
}
