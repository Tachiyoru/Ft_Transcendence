import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-github2'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
	constructor(configService: ConfigService)
	{
		console.log('githubStrategy');
		super({
			clientID: '800139fb6ffa77c9e67d',
			secret: 'c36770b6841a075878ccd1e9bd147cd79da90090',
			callbackURL: 'http://localhost:5000/auth/github/callback',
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any)
	{
		return profile;
	}
}
