import {
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
export class SocketTokenGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== "ws") {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const client: Socket = context.switchToWs().getClient();
	const token = client.handshake.headers.cookie?.split("=")[2].split(";")[0];
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.jwt.verifyAsync(token, {
      secret: this.config.get<string>("JWT_SECRET_REFRESH"),
    });
    if (!payload) {
      throw new UnauthorizedException();
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
	  include: { friends: true, stats: true, achievements: true },
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
// client.handshake.headers.cookie = `token=${token}`;
	client.handshake.auth = user ;
	request.user = user;
    return true;
  }

  static verifyToken(token: string, jwt: JwtService, config: ConfigService) {
    const payload = jwt.verifyAsync(token, {
      secret: config.get<string>("JWT_SECRET_REFRESH"),
    });
    return payload;
  }

  static validateToken(client: Socket) {
	const token = client.handshake.headers.cookie?.split("=")[2].split(";")[0];
	console.log("validatetoken : ", token);
	if (!token) {
      throw new UnauthorizedException();
    }
    console.log("token : ", token);
    return SocketTokenGuard.verifyToken(token, new JwtService, new ConfigService);
  }
}