import { Get, Injectable, Options, Param } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";
import { authenticator } from "otplib";
import { AuthService } from "src/auth/auth.service";
import { GetUser } from "src/auth/decorator";
import { toDataURL, toFileStream } from "qrcode";
import { Response } from "express";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TwoFAService
{
	constructor(
		private readonly configService: ConfigService,
		private authService: AuthService,
		private readonly prismaService: PrismaService
	) {}

	async generate2FASecret(user: User): Promise<string>
	{
		const secret = authenticator.generateSecret();
		const issuerName: string =
			this.configService.get<string>("ISSUER_NAME") || "DEFAULT_NAME";

		const otpAuthUrl: string = authenticator.keyuri(
			user.email,
			issuerName,
			secret
		);

		await this.set2FaSecret(secret, user.id);
		// console.log('otpAuthUrl : ', otpAuthUrl);
		console.log("user.twoFaSecret : ", user.twoFASecret);
		return otpAuthUrl;
	}

	async qrcodeStream(otpAuthUrl: string)
	{
		return toDataURL(otpAuthUrl);
	}

	async verify2FACode(@GetUser() user: User, token: string): Promise<boolean>
	{
		try
		{
			const secret: string = user.twoFASecret || "";
			console.log('verify2FACode -> token : ', token);
			console.log('verify2FACode -> secret : ', secret);
			const isValid = authenticator.verify({ token, secret });
			console.log("verify2FACode -> isValid : ", isValid);
			return isValid;
		} catch (err)
		{
			console.error(err);
			return false;
		}
	}

	async set2FaOtpAuthUrl(otpAuthUrl: string, userId: number): Promise<User> {
		const updatedUser = this.prismaService.user.update({
		where: { id: userId },
		data: { otpAuthUrl: otpAuthUrl },
		});
		return updatedUser;
	}
	
	
	async set2FaSecret(secret: string, userId: number): Promise<User> {
		const updatedUser = this.prismaService.user.update({
		where: { id: userId },
		data: { twoFASecret: secret },
		});
		return updatedUser;
	}
}
