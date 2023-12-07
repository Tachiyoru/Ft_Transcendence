import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TokenGuard implements CanActivate
{
	constructor(
		private jwt: JwtService,
		private config: ConfigService,
		private prisma: PrismaService
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean>
	{
		const request: Request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromCookie(request);
		console.log("payloaaaaaaaaaaaaaaaaaad", token);
		if (!token)
		{
			throw new UnauthorizedException();
		}
		try
		{
			console.log("token traitement");
			const payload = await this.jwt.verifyAsync(token, {
				secret: this.config.get<string>('JWT_SECRET_ACCESS'),
			});
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