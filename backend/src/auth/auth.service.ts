import { ForbiddenException, Injectable, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, AuthDto2 } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { error } from "console";

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          hash,
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002")
          throw new ForbiddenException("email already exists");
      }
    }
    throw error;
  }

  async signin(dto: AuthDto2) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException("User not found");
    const pwdMatches = await argon.verify(user.hash, dto.password);
    if (!pwdMatches) throw new ForbiddenException("Wrong password");
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get("JWT_SECRET");

    const token = await this.jwt.signAsync(payload, {
      expiresIn: "15m",
      secret: secret,
    });
    return { access_token: token };
  }

  async fortyTwoAuth(req: any, res: any) {
    const fortyTwoId: number = parseInt(req.user.id);
    console.log("fortytwoauth", req.user);
    const fortyTwoAvatar: string = req.user._json.image.link;
    const fortyTwoEmail: string = req.user.email;

    const user = await this.findUserByFortyTwoId(fortyTwoId);
    if (!user) {
      const payload = { fortyTwoId, fortyTwoAvatar };
      const token = await this.signToken(fortyTwoId, fortyTwoEmail);
      console.log("usernull in fortytwoauth");
      await this.setAccessTokenCookie(res, token.access_token, 3600000);

      return res.redirect("https://google.com");
    }
    const payload = { id: user.id, email: user.email };
    const token = await this.signToken(payload.id, payload.email);
    res.cookie("user_token", token.access_token, {
      expires: new Date(Date.now() + 3600000),
    });
	
    return res.redirect("https://google.com");
  }

  private async setAccessTokenCookie(
    res: any,
    token: string,
    expiresIn: number
  ) {
    const expirationTime = new Date(Date.now() + expiresIn);

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "strict",
      expires: expirationTime,
    });
  }

  private async findUserByFortyTwoId(fortyTwoId: number) {
    return this.prisma.user.findUnique({
      where: { fortyTwoId },
    });
  }
}
