import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, AuthDto2 } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { User } from "@prisma/client";
import { GetUser } from "./decorator";
import { TokenGuard } from "./guard";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
  constructor(
    private config: ConfigService,
    private readonly authService: AuthService
    ) {}

  @Post("signup")
  async signup(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.authService.signup(dto, res);
	// if (user)
	// 	await addAchievementByUserId(user.user.id, 1);
    return { user };
  }

  @Post("signin")
  async signin(
    @Body() dto: AuthDto2,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.authService.signin(dto, res);
    return { user };
  }

  @UseGuards(TokenGuard)
  @Post("logout")
  async logout(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.logout(user, res);
    return;
  }

  @Get("refresh")
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.refresh(req, res);
  }

  @Get("/42/callback")
  @UseGuards(AuthGuard("42"))
  async fortyTwoCallback(@Req() req: Request, @Res() res: Response) {
    if (req.user === undefined) throw new UnauthorizedException();
    const user = req.user as User;
    let raw = req.user as any;
    user.username = user.username + "_42";
    const user2 = await this.authService.authExtUserCreate(
      user,
      raw._json.image.versions.small
    );
    await this.authService.callForgeTokens(user2, res);
    if (!user2.isTwoFaEnabled)
      res.redirect('http://paul-f4ar1s4:5173/');
    else
      res.redirect('http://paul-f4ar1s4:5173/sign-in-2fa');
    return user2;
  }

  @Get("/github/callback")
  @UseGuards(AuthGuard("github"))
  async GithubCallback(@Req() req: Request, @Res() res: Response) {
    if (req.user === undefined) throw new UnauthorizedException();
    const user: User = req.user as User;
    let raw = req.user as any;
    user.username = user.username + "_git";
    const user2 = await this.authService.authExtUserCreate(
      user,
      raw._json.avatar_url
    );
    await this.authService.callForgeTokens(user2, res);
    res.redirect(`${process.env.REACT_APP_URL_FRONTEND}`);
    return user2;
  }
}
