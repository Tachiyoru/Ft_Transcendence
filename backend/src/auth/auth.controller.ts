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
import { AuthDto, AuthDto2 } from './dto';
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
		return res.cookie;
	}

	@Post('signin')
	async signin(@Body() dto: AuthDto2, @Res({ passthrough: true }) res: any)
	{
		const tokens = await this.authService.signin(dto);
		res.cookie('user_token', tokens.access_token, {
			expires: new Date(Date.now() + 3600000),
		});
		return 'coubeh';
	}

	@UseGuards(AuthGuard('42'))
	@Get('42Auth')
	async fortyTwo(@Req() req: Request, @Res({ passthrough: true }) res: any)
	{
		console.log('42Auth');
		return this.authService.fortyTwoAuth(req, res);
	}

	@Get('/42/callback')
	@UseGuards(AuthGuard('42'))
	async callback(@Req() req: Request, @Res() res: Response)
	{
		res.header('Access-Control-Allow-Origin', '*');

		if (req.user === undefined) throw new UnauthorizedException();
		const user: User = req.user as User;
		const token = await this.authService.signToken(user.id, user.email);

		res.cookie('access_token', token, {
			expires: new Date(Date.now() + 3600000),
		});
		console.log("lol", req.cookies.access_token);

		return res.redirect(`http://localhost:5000/auth/42/callback'`); //change to profil frontend url
	}
}


// async logout(@Res({ passthrough: true }) res) {
//     res.cookie('user_token', '', { expires: new Date(Date.now()) });
//     return {};
//   }
