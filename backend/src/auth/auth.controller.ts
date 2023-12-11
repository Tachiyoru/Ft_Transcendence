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
	async signin(@Body() dto: AuthDto2, @Req() req: Request, @Res({ passthrough: true }) res: Response)
	{
		const user = await this.authService.signin(dto, res);
		console.log(req.cookies.access_token);
		console.log("token post singin = ", req.cookies.refresh_token)
		return { user };
	}
	
	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response)
	{
		return await this.authService.logout(res);
	}

	@Get('/42/callback')
	@UseGuards(AuthGuard('42'))
	async fortyTwoCallback(@Req() req: Request, @Res() res: Response)
	{
		if (req.user === undefined) throw new UnauthorizedException();
		const user = req.user as User;
		user.username = user.username+"_42";
		const user2 = await this.authService.authExtUserCreate(user)
		// console.log({user});
		await this.authService.callForgeTokens(user2, res);

		console.log('fortyTwoCallback --> access_token', req.cookies.access_token);

		res.redirect('http://localhost:5173/');
		// console.log("aaaaaaaaaaaaaaaaaaaaaaaaa", {user})
		return user2;
	}

	@Get('/github/callback')
	@UseGuards(AuthGuard('github'))
	async GithubCallback(@Req() req: Request, @Res() res: Response)
	{
		if (req.user === undefined) throw new UnauthorizedException();
		const user: User = req.user as User;
		user.username = user.username+"_git";
		const user2 = await this.authService.authExtUserCreate(user)
		await this.authService.callForgeTokens(user2, res);

		console.log(req.cookies.access_token);

		res.redirect(`http://localhost:5173/`);
		return user2;
	}
}
