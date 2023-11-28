import { Injectable, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { AuthService } from 'src/auth/auth.service';
import { GetUser } from 'src/auth/decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TwoFaService
{
	constructor(
		private readonly configService: ConfigService,
		private authService: AuthService,
		private prisma: PrismaService,
	) {}

	async generateQrCode(user: User): Promise<string>
	{
		console.log('Generate QR Code');
		const secret = authenticator.generateSecret();
		const issuerName: string = this.configService.get<string>('ISSUER_NAME') || 'DEFAULT_NAME';

		const otpAuthUrl: string = authenticator.keyuri(user.email, issuerName, secret)

		await this.authService.set2FASecret(user, secret, user.id)
		return (otpAuthUrl);
	}

	async verify2FACode(@GetUser() user: User, token: string): Promise<boolean>
	{
		console.log('Verify 2FA Code');

		try
		{
			const secret: string = user.twoFASecret || "";
			const isValid = authenticator.verify({ token, secret });
			return (isValid);
		} catch (err)
		{
			console.error(err);
			return (false);
		}
	}
}
