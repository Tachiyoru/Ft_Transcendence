import { Controller, ForbiddenException, Post, Res } from '@nestjs/common';
import { TwoFaService } from './two-fa.service';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('two-fa')
export class TwoFaController
{
	constructor(
		private readonly twoFaService: TwoFaService,
		private readonly authService: AuthService,
	) {}

	@Post('generate-qrcode')
	async generate(@Res() res: Response, @GetUser() user: User)
	{
		const otpAuthUrl = await this.twoFaService.generateQrCode(user);
	}

	@Post('authenticate')
	async authenticateWith2FA(@GetUser() user: User, token: string)
	{
		const isValid = await this.twoFaService.verify2FACode(user, token);
		if (!isValid)
			throw new ForbiddenException("Invalid 2FA Token");
		const access_token = await this.authService.signToken(user.id, user.email);

		return { user, access_token };
	}
}
