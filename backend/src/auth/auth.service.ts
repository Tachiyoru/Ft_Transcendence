import { ForbiddenException, Injectable, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, AuthDto2 } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { error } from "console";
import { User } from "@prisma/client";
import { GetUser } from "./decorator";
import { Response } from "express";
import { UserService } from "src/user/user.service";

@Injectable({})
export class AuthService
{
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
		private user: UserService,
	) {}

	async signup(dto: AuthDto, res: Response)
	{
		const hash = await argon.hash(dto.password);
		try
		{
			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					username: dto.username,
					hash,
					stats: {
						create: {},
					},
				},
			});
			return (this.forgeTokens(user, res));
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
			where: {
				email: dto.email,
			},
		});
		if (user)
			console.log("user exist")
		if (!user) throw new ForbiddenException("User not found");
		const pwdMatches = await argon.verify(user.hash ?? "", dto.password);
		if (!pwdMatches) throw new ForbiddenException("Wrong password");
		return (this.forgeTokens(user, res));
	}

	async authExtUserCreate(userInfo: any)
	{
		const name: string = userInfo.username;
		const email: string = userInfo._json.email ?? "";
		const user = await this.prisma.user.findFirst({
			where: { username: name }
		});
		if (!user)
		{
			const user2 = await this.prisma.user.create({
				data: {
					email: email,
					username: name,
					hash: "",
					stats: {
						create: {},
					},
				}
			})
			console.log({ user2 });
			return user2;
		}// console.log("info in real user= ", user)
		return user;
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
		console.log("token1", accessToken);
		const refreshToken = this.jwt.sign(payload, {
			secret: this.config.get<string>("JWT_SECRET_REFRESH"),
			expiresIn: "7d",
		});
		console.log("token2", refreshToken)
		response.cookie("access_token", accessToken, { httpOnly: true });
		response.cookie("refresh_token", refreshToken, { httpOnly: true });
		console.log("la", response.cookie)
		return { user };
	}

	async callForgeTokens(user: User, res: any)
	{
		return (this.forgeTokens(user, res));
	}

	async logout(response: Response)
	{
		response.clearCookie("access_token");
		response.clearCookie("refresh_token");
		return ("Successfully logged out");
	}

	async set2FASecret(secret: string, userId: number): Promise<User>
	{
		const userA = this.prisma.user.update({
			where: { id: userId },
			data: { twoFASecret: secret },
		});
		return (userA);
	}

	getUserByEmail(email: string)
	{
		const user = this.prisma.user.findUnique({
			where: { email },
		});
		return (user);
	}
}
