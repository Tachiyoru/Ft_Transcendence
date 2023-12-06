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

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.authService.signup(dto, res);
    return { user };
  }

  @Post("signin")
  async signin(@Body() dto: AuthDto2, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.signin(dto, res);
    return { user };
  }

  async logout(@Res({ passthrough: true }) res: Response) {
	return await this.authService.logout(res);
  }

  @Get("/42/callback")
  @UseGuards(AuthGuard("42"))
  async callback(@Req() req: Request, @Res() res: Response) {
    if (req.user === undefined) throw new UnauthorizedException();
    const user: User = req.user as User;
    await this.authService.fortyTwoAuth(user, res);
    return res.redirect(`https://google.com`); //change to profil frontend url
  }
}
