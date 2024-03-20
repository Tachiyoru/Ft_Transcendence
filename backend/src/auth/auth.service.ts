import { ForbiddenException, Injectable, Redirect, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, AuthDto2 } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { error } from "console";
import { StatusUser, User } from "@prisma/client";
import { Request, Response } from "express";

@Injectable({})
export class AuthService
{
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
	) {}

	async signup(dto: AuthDto, res: Response)
	{
		const hash = await argon.hash(dto.password);
		try
		{
			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					originMail: dto.email,
					username: dto.username,
					hash,
					stats: {
						create: {},
					},
				},
			});
			return this.forgeTokens(user, res);
		} catch (error)
		{
			if (error instanceof PrismaClientKnownRequestError)
			{
				if (error.code === "P2002")
					throw new ForbiddenException("email already exists");
			}
		}
		throw error;
	}

	async signin(dto: AuthDto2, res: Response)
	{
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
			include: { friends: true, stats: true, achievements: true },
		});
		if (!user)
			throw new ForbiddenException("User not found");
		const pwdMatches = await argon.verify(user.hash ?? "", dto.password);
		if (!pwdMatches)
			throw new ForbiddenException("Wrong password");
		if (!user.isTwoFaEnabled)
		{
			const updatedUser = await this.prisma.user.update({
				where: { id: user.id },
				data: { status: 'ONLINE' }
			});
			return (this.forgeTokens(updatedUser, res));
		}
		await this.forgeTokens(user, res);
		return user;
	}

	async authExtUserCreate(userInfo: any, imageLink: string)
	{
		{
			const name: string = userInfo.username;
			const email: string = userInfo._json.email ?? name + "@platform.fr";
			const user = await this.prisma.user.findFirst({
				where: { originMail: email},
				include: { friends: true, stats: true, achievements: true },
			});
			if (!user)
			{
				const user2 = await this.prisma.user.create({
					data: {
						email: email,
						originMail: email,
						username: name,
						hash: "",
						avatar: imageLink,
						stats: {
							create: {},
						},
					},
				});
				return user2;
			}
			user.status = StatusUser.ONLINE;
			return user;
		}
	}

	async refresh(request: Request, response: Response)
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
			if (!user) throw new ForbiddenException("User not found");
			return this.reForgeTokens(user, response);
		} catch (err)
		{
			throw new ForbiddenException("Invalid token");
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

	private async forgeTokens(user: User, response: Response)
	{
		const payload = { username: user.username, sub: user.id };
		const accessToken = this.jwt.sign(
			{ ...payload },
			{
				secret: this.config.get<string>("JWT_SECRET_ACCESS"),
				expiresIn: "150sec",
			}
		);
		const refreshToken = this.jwt.sign(payload, {
			secret: this.config.get<string>("JWT_SECRET_REFRESH"),
			expiresIn: "7d",
		});
		response.cookie("access_token", accessToken, { httpOnly: true });
		response.cookie("refresh_token", refreshToken, { httpOnly: true });
		return { user };
	}

	async callForgeTokens(user: User, res: any)
	{
		return this.forgeTokens(user, res);
	}

	async logout(userA: User, response: Response)
	{
		if (!userA) throw new ForbiddenException("User not found");
		await this.prisma.user.update({
			where: { id: userA.id },
			data: { status: 'OFFLINE' }
		});
		console.log("user disconnected");
		response.clearCookie("access_token");
		response.clearCookie("refresh_token");
		return "Successfully logged out";
	}
}