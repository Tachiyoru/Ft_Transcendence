import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { Request, response } from "express";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SocketTokenGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const string = context.switchToHttp().getRequest().handshake.headers.cookie;
    const test = string.split("; ");
    console.log("payloaaaaaaaaaaaaaaaaaad", test);
    // const [name, value] = test[0].split("=");
    const [name2, value2] = test[1].split("=");
    // if (name === "access_token") {
    //   return value;
    // const token = value?? "";
    // const token = this.extractTokenFromCookie(request);
    console.log("payloaaaaaaaaaaaaaaaaaad", value2);
    if (!value2) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwt.verifyAsync(value2, {
        secret: this.config.get<string>("JWT_SECRET_ACCESS"),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      request.user = user;
    } catch (err) {
      // try {
      //   console.log("refresher called");
      //   const user = this.refresh(request, value2);
      //   request.user = user;
      //   return true;
      // } catch (err) {
      //   throw new UnauthorizedException("Token non valid ");
      // }
        throw new UnauthorizedException("Token non valid ");
    }
    return true;
  }

  // private async refresh(request: Request, value: string) {
  //   if (!value) throw new ForbiddenException("No token provided");
  //   try {
  //     const payload = await this.jwt.verifyAsync(value, {
  //       secret: this.config.get<string>("JWT_SECRET_REFRESH"),
  //     });
  //     const user = await this.prisma.user.findUnique({
  //       where: { id: payload.sub },
  //     });
  //     if (!user) throw new ForbiddenException("Invalid token");
  //     this.reForgeTokens(user);
  //     return user;
  //   } catch (err) {
  //     throw new ForbiddenException();
  //   }
  // }

  // private async reForgeTokens(user: User) {
  //   const payload = { username: user.username, sub: user.id };
  //   const accessToken = this.jwt.sign(
  //     { ...payload },
  //     {
  //       secret: this.config.get<string>("JWT_SECRET_ACCESS"),
  //       expiresIn: "150sec",
  //     }
  //   );
  //   // response.cookie("access_token", accessToken, { httpOnly: true });
  //   return { user };
  // }


  private extractTokenFromCookie(request: Request): string | undefined {
    const accessToken = request.cookies?.access_token;
    return accessToken;
  }
}
