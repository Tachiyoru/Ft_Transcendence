import
	{
		CanActivate,
		ExecutionContext,
		ForbiddenException,
		Injectable,
		UnauthorizedException,
	} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, response } from "express";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class TokenGuard implements CanActivate
{
	constructor(
		private jwt: JwtService,
		private config: ConfigService,
		private prisma: PrismaService,
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean>
	{
		const response = context.switchToHttp().getResponse();
		const request: Request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromCookie(request);
		if (!token)
		{
			throw new UnauthorizedException();
		}
		try
		{
			console.log("token traitement");
			const payload = await this.jwt.verifyAsync(token, {
				secret: this.config.get<string>("JWT_SECRET_ACCESS"),
			});
			const user = await this.prisma.user.findUnique({
				where: { id: payload.sub },
			});
			if (!user)
			{
				throw new UnauthorizedException("User not found");
			}
			request.user = user;
		} catch (err)
		{
			try
			{
				console.log("refresher called");
				const user = this.refresh(request, response);
				request.user = user;
				return true;
			} catch (err)
			{
				throw new UnauthorizedException("Token non valid ");
			}
		}
		return true;
	}

	private async refresh(request: Request, response: Response)
	{
		const refreshToken = request.cookies?.refresh_token;
		if (!refreshToken) throw new ForbiddenException("No token provided");
		try
		{
			const payload = await this.jwt.verifyAsync(refreshToken, {
				secret: this.config.get<string>("JWT_SECRET_REFRESH"),
			});
			const user = await this.prisma.user.findUnique({
				where: { id: payload.sub },
			});
			if (!user) throw new ForbiddenException("Invalid token");
			this.reForgeTokens(user, response);
			return user;
		} catch (err)
		{
			throw new ForbiddenException();
		}
	}

	private async reForgeTokens(user: User, response: Response)
	{
		const payload = { username: user.username, sub: user.id };
		const accessToken = this.jwt.sign(
			{ ...payload },
			{
				secret: this.config.get<string>("JWT_SECRET_ACCESS"),
				expiresIn: "150sec",
			}
		);
		response.cookie("access_token", accessToken, { httpOnly: true });
		return { user };
	}

	private extractTokenFromCookie(request: Request): string | undefined
	{
		const accessToken = request.cookies?.access_token;
		return accessToken;
	}
}
