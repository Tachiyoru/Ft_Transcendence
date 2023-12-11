import { Injectable, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { AuthService } from 'src/auth/auth.service';
import { GetUser } from 'src/auth/decorator';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class TwoFAService
{
	constructor(
		private readonly configService: ConfigService,
		private authService: AuthService,
	) {}

	async generate2FASecret(@GetUser() user: User): Promise<string>
	{
		// console.log('Generate QR Code');

		const secret = authenticator.generateSecret();
		const issuerName: string = this.configService.get<string>('ISSUER_NAME') || 'DEFAULT_NAME';

		const otpAuthUrl: string = authenticator.keyuri(user.email, issuerName, secret)

		await this.authService.set2FASecret(secret, user.id)
		// console.log('otpAuthUrl : ', otpAuthUrl);
		return (otpAuthUrl);
	}

	async qrcodeStream(stream: Response, otpAuthUrl: string)
	{
		return toFileStream(stream, otpAuthUrl);
	}

	async verify2FACode(@GetUser() user: User): Promise<boolean>
	{
		// console.log('Verify 2FA Code');
		// console.log({ user });

		try
		{
			// console.log('verify2FACode -> user.twoFASecret : ', user.twoFASecret);
			const secret: string = user.twoFASecret || "";
			const token = authenticator.generate(secret);
			// console.log('verify2FACode -> token : ', token);
			// console.log('verify2FACode -> secret : ', secret);
			const isValid = authenticator.verify({ token, secret });
			console.log('verify2FACode -> isValid : ', isValid);
			return (isValid);
		} catch (err)
		{
			console.error(err);
			return (false);
		}
	}
}
