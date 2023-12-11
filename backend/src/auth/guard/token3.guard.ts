import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { access } from "fs";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TokenGuardtwo implements CanActivate
{
	constructor(
		private jwt: JwtService,
		private config: ConfigService,
		private prisma: PrismaService
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean>
	{
		const request = context.switchToHttp().getRequest();
		const string = context.switchToHttp().getRequest().handshake.headers.cookie;
		const test = string.split('; ');
		console.log("payloaaaaaaaaaaaaaaaaaad", test);
		const [name, value] = test[0].split('=');
		// if (name === "access_token") {
		//   return value;
		// const token = value?? "";
		// const token = this.extractTokenFromCookie(request);
		console.log("payloaaaaaaaaaaaaaaaaaad", value);
		if (!value)
		{
			throw new UnauthorizedException();
		}
		try
		{
			console.log("token traitement");
			const payload = await this.jwt.verifyAsync(value, {
				secret: this.config.get<string>('JWT_SECRET_ACCESS'),
			});
			console.log("aaaaaa")
			const user = await this.prisma.user.findUnique({
				where: { id: payload.sub },
			});
			if (!user) {
			throw new UnauthorizedException();
			}
			request.user = user;
		} catch (err)
		{
			throw new UnauthorizedException();
		}
		return true;
	}

	private extractTokenFromCookie(request: Request): string | undefined
	{
		const accessToken = request.cookies?.access_token;
		return accessToken
	}
}