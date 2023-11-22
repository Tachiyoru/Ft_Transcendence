import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
	constructor(configService: ConfigService)
	{
		console.log('42Strategy');
		super({
			clientID: 'u-s4t2ud-84783a175e5824b0279ef6d3bbf9eaebf0121dfdfd8a1b5a07299883312a2a2f',
			clientSecret: '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',
			callbackURL: 'http://localhost:5000/auth/42/callback',
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any)
	{
		return profile;
	}
}
