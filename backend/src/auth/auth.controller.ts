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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController
{
	constructor(private authService: AuthService) {}

	@Post('signup')
	async signup(@Body() dto: AuthDto, @Res({ passthrough: true }) res: any)
	{
		const tokens = await this.authService.signup(dto);
		res.cookie('user_token', tokens.access_token, {
			expires: new Date(Date.now() + 360000000),
		});
		return 'feur';
	}

	@Post('signin')
	async signin(@Body() dto: AuthDto, @Res({ passthrough: true }) res: any)
	{
		const tokens = await this.authService.signin(dto);
		res.cookie('user_token', tokens.access_token, {
			expires: new Date(Date.now() + 3600000),
		});
		return 'coubeh';
	}

	@UseGuards(AuthGuard('42'))
	@Get('42')
	async fortyTwo(@Req() req: Request, @Res({ passthrough: true }) res: any)
	{
		console.log('42');
		return this.authService.fortyTwoAuth(req, res);
	}

	@Get('/42/callback')
	@UseGuards(AuthGuard('42'))
	async fortyTwoCallback(@Req() req: Request, @Res() res: Response)
	{
		if (req.user === undefined) throw new UnauthorizedException();
		const user: User = req.user as User;

		console.log({ user_id: user.id, user_email: user.email });
		
		const token = await this.authService.signToken(user.id, user.email);

		console.log('fortyTwoCallback ---> access_token', token);
		res.cookie('access_token', token, {
			expires: new Date(Date.now() + 3600000),
		});
		console.log(req.cookies.access_token);

		return res.redirect(`https://google.com`); //change to profil frontend url
	}

	@UseGuards(AuthGuard('github'))
	@Get('github')
	async github(@Req() req: Request, @Res({ passthrough: true }) res: any)
	{
		console.log('github Auth');
		return this.authService.githubAuth(req, res);
	}

	@Get('/github/callback')
	@UseGuards(AuthGuard('github'))
	async GithubCallback(@Req() req: Request, @Res() res: Response)
	{
		if (req.user === undefined) throw new UnauthorizedException();
		const user: User = req.user as User;
		const token = await this.authService.signToken(user.id, user.email);

		res.cookie('access_token', token, {
			expires: new Date(Date.now() + 3600000),
		});
		console.log(req.cookies.access_token);

		return res.redirect(`https://google.com`); //change to profil frontend url
	}
}
