import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-42";
import { config } from "process";
@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, "42") {
  constructor(configService: ConfigService) {
    // console.log('42Strategy');
    super({
      clientID: configService.get("f_CLIENT_ID"),
      clientSecret: configService.get("f_CLIENT_SECRET"),
      callbackURL: configService.get("f_CALLBACK_URL"),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return profile;
  }
}
