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
    const token = client.handshake.headers.cookie?.split("=")[1].split(";")[0]
    if (!token) {
        throw new UnauthorizedException();
    }
    const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get<string>("JWT_SECRET_ACCESS"),
      });
      if (!payload) {throw new UnauthorizedException();}
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException("User not found");
      }
      request.user = user;
    return false;
  }
}