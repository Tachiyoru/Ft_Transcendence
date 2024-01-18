import
	{
		Body,
		Controller,
		ForbiddenException,
		Get,
		Param,
		Post,
		Res,
		UseGuards,
	} from "@nestjs/common";
import { TwoFAService } from "./two-fa.service";
import { AuthService } from "src/auth/auth.service";
import { Response } from "express";
import { User } from "@prisma/client";
import { TokenGuard } from "../guard";
import { GetUser } from "../decorator";

@Controller("two-fa")
@UseGuards(TokenGuard)
export class TwoFaController
{
	constructor(
		private readonly twoFAService: TwoFAService,
		private readonly authService: AuthService
	) {}

	@Get("generate-qrcode")
	async generate(@GetUser() user: User)
	{
		if (user)
		{
			const otpAuthUrl = await this.twoFAService.generate2FASecret(user);
			const qrcodeStream = await this.twoFAService.qrcodeStream(
				otpAuthUrl
			);
			this.twoFAService.set2FaOtpAuthUrl(qrcodeStream, user.id);
			return qrcodeStream;
		}
	}

	@Post("authenticate")
	async authenticateWith2FA(@GetUser() user: User, @Res() res: Response, @Body() body: { token: string} )
	{
		if (user)
		{
			const isValid = await this.twoFAService.verify2FACode(user, body.token);
			if (!isValid)
				throw new ForbiddenException("Invalid 2FA Token");
			const access_token = await this.authService.callForgeTokens(user, res);

			return { user, access_token };
			// res.redirect("https://google.com");
		}
	}
}
