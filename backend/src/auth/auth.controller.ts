import
{
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
export class AuthController
{
	constructor(private readonly authService: AuthService) {}

	@Post("signup")
	async signup(
		@Body() dto: AuthDto,
		@Res({ passthrough: true }) res: Response
	)
	{
		const user = await this.authService.signup(dto, res);
		return { user };
	}

	@Post("signin")
	async signin(@Body() dto: AuthDto2, @Res({ passthrough: true }) res: Response)
	{
		const user = await this.authService.signin(dto, res);
		return { user };
	}

	async logout(@Res({ passthrough: true }) res: Response)
	{
		return await this.authService.logout(res);
	}

	@Get('/42/callback')
	@UseGuards(AuthGuard('42'))
	async fortyTwoCallback(@Req() req: Request, @Res() res: Response)
	{
		if (req.user === undefined) throw new UnauthorizedException();
		const user: User = req.user as User;
		console.log({user});
		await this.authService.callForgeTokens(user, res);

		console.log('fortyTwoCallback --> access_token', req.cookies.access_token);

		res.redirect('http://localhost:5173/');
		return user;//change to profil frontend url
	}

	@Get('/github/callback')
	@UseGuards(AuthGuard('github'))
	async GithubCallback(@Req() req: Request, @Res() res: Response)
	{
		if (req.user === undefined) throw new UnauthorizedException();
		const user: User = req.user as User;
		await this.authService.callForgeTokens(user, res);

		console.log(req.cookies.access_token);

		return res.redirect(`http://localhost:5173/auth/42/callback'`); //change to profil frontend url
	}
}
