import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";
import { Socket } from "socket.io";

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
	let token: any;
	const request: Request = context.switchToHttp().getRequest();
    if (context.getType() === "ws") {
      const client: Socket = context.switchToWs().getClient();
      token = client.handshake.headers.cookie
        ?.split("=")[1]
        .split(";")[0];
    } else {
		token = this.extractTokenFromCookie(request);
    }
	const response = context.switchToHttp().getResponse();
    if (!token) {
		token = this.extractTokenFromCookie(request);
		if (!token)
      	throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get<string>("JWT_SECRET_ACCESS"),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException("User not found");
      }
      request.user = user;
    } catch (err) {
      try {
        const user = this.refresh(context, request, response);
        request.user = user;
        return true;
      } catch (err) {
        throw new UnauthorizedException("Token non valid ");
      }
    }
    return true;
  }

  private async refresh(context: ExecutionContext, request: Request, response: Response) {
    let token;
    if (context.getType() === "ws") {
      const client: Socket = context.switchToWs().getClient();
      token = client.handshake.headers.cookie?.split("=")[2].split(";")[0];
    }else {
      token = request.cookies?.refresh_token;
    }
    if (!token) throw new ForbiddenException("No token provided");
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get<string>("JWT_SECRET_REFRESH"),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) throw new ForbiddenException("Invalid token");
      this.reForgeTokens(context, user, response);
      return user;
    } catch (err) {
      throw new ForbiddenException();
    }
  }

  private async reForgeTokens(context: ExecutionContext, user: User, response: Response) {
    const payload = { username: user.username, sub: user.id };

    const accessToken = this.jwt.sign(
      { ...payload },
      {
        secret: this.config.get<string>("JWT_SECRET_ACCESS"),
        expiresIn: "150sec",
      }
    );
    return { user };
}


  private extractTokenFromCookie(request: Request): string | undefined {
    const accessToken = request.cookies?.access_token;
    return accessToken;
  }
}