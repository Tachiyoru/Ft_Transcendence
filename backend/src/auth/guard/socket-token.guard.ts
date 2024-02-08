import
{
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SocketTokenGuard implements CanActivate
{
	constructor(
		private jwt: JwtService,
		private config: ConfigService,
		private prisma: PrismaService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean>
	{
		const request = context.switchToHttp().getRequest();
		if (request.user) return true;
		if (context.getType() !== "ws")
		{
			return true;
		}
		const client: Socket = context.switchToWs().getClient();
		let token;
		if (client.handshake.headers.cookie?.split("=")[0] === "io")
		{
			token = client.handshake.headers.cookie?.split("=")[3].split(";")[0];
		} else
		{
			token = client.handshake.headers.cookie?.split("=")[2].split(";")[0];
		}

		try
		{
			if (token)
			{
				const payload = await this.jwt.verifyAsync(token, {
					secret: this.config.get<string>("JWT_SECRET_REFRESH"),
				});

				const user = await this.prisma.user.findUnique({
					where: { id: payload.sub },
					include: { friends: true, stats: true, achievements: true },
				});

				if (!user)
				{
					throw new UnauthorizedException("User not found");
				}

				client.handshake.auth = user;
				request.user = user;
			}
			return true;
		} catch (error)
		{
			throw new UnauthorizedException("Invalid token");
		}
	}

	static verifyToken(token: string, jwt: JwtService, config: ConfigService)
	{
		const payload = jwt.verifyAsync(token, {
			secret: config.get<string>("JWT_SECRET_REFRESH"),
		});
		return payload;
	}

	static validateToken(client: Socket)
	{
		const token = client.handshake.headers.cookie?.split("=")[2].split(";")[0];
		if (!token)
		{
			throw new UnauthorizedException();
		}
		return SocketTokenGuard.verifyToken(
			token,
			new JwtService(),
			new ConfigService()
		);
	}
}
