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
			clientID: configService.get('GITHUB_CLIENT_ID'),
			clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
			callbackURL: configService.get('GITHUB_CALLBACK_URL'),
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any)
	{
		return profile;
	}
}
