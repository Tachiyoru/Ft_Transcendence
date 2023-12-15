import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Res,
} from "@nestjs/common";
import { TwoFAService } from "./two-fa.service";
import { AuthService } from "src/auth/auth.service";
import { Response } from "express";
import { User } from "@prisma/client";

@Controller("two-fa")
export class TwoFaController {
  constructor(
    private readonly twoFAService: TwoFAService,
    private readonly authService: AuthService
  ) {}

  @Post("generate-qrcode")
  async generate(@Res() res: Response, @Body() body: User) {
    const str = body.email;
    const user: User | null = await this.authService.getUserByEmail(str);
    if (user) {
      const otpAuthUrl = await this.twoFAService.generate2FASecret(user);
      const qrcodeStream = await this.twoFAService.qrcodeStream(
        res,
        otpAuthUrl
      );
      return qrcodeStream;
    }
  }

  @Post("authenticate")
  async authenticateWith2FA(@Body() body: User, @Res() res: Response) {
    const user = await this.authService.getUserByEmail(body.email);
    if (user) {
      const isValid = await this.twoFAService.verify2FACode(user);
      if (!isValid) throw new ForbiddenException("Invalid 2FA Token");
      const access_token = await this.authService.callForgeTokens(user, res);

      // return { user, access_token };
      res.redirect("https://google.com");
    }
  }
}
