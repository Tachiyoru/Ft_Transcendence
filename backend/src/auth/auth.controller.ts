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
  constructor(private authService: AuthService) {}

  @Post("signup")
  async signup(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.signup(dto, res);
    return { user };
  }

  @Post("signin")
  async signin(@Body() dto: AuthDto2, @Res({ passthrough: true }) res: any) {
    const user = await this.authService.signin(dto, res);
    return { user };
  }

  @Get("/42/callback")
  @UseGuards(AuthGuard("42"))
  async callback(@Req() req: Request, @Res() res: Response) {
    if (req.user === undefined) throw new UnauthorizedException();
	console.log('callback successsssssss');
    const user: User = req.user as User;
    await this.authService.fortyTwoAuth(user, res);
    console.log(req.cookies.access_token);
	console.log('callback success');
    return res.redirect(`https://google.com`); //change to profil frontend url
  }
}

// async logout(@Res({ passthrough: true }) res) {
//     res.cookie('user_token', '', { expires: new Date(Date.now()) });
//     return {};
//   }
