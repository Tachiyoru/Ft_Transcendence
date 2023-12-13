import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, "42") {
	constructor(configService: ConfigService)
	{
		// console.log("42Strategy");
		super({
			clientID: configService.get("FORTYTWO_CLIENT_ID"),
			clientSecret: configService.get("FORTYTWO_CLIENT_SECRET"),
			callbackURL: configService.get("FORTYTWO_CALLBACK_URL"),
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any)
	{
		return profile;
	}
}
