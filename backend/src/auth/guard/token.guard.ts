import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class TokenGuard implements CanActivate
{
	constructor(
		private jwt: JwtService,
		private config: ConfigService,
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean>
	{
		const request: Request = context.switchToHttp().getRequest();
		console.log("payloaaaaaaaaaaaaaaaaaad", request.cookies);
		const token = this.extractTokenFromCookie(request);
		// console.log("payloaaaaaaaaaaaaaaaaaad", token);
		if (!token)
		{
			throw new UnauthorizedException();
		}
		try
		{
			const payload = await this.jwt.verifyAsync(token, {
				secret: this.config.get<string>('JWT_SECRET_ACCESS'),
			});
			request['user'] = payload;
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