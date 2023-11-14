import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthDto, @Res({ passthrough: true }) res: any) {
    const tokens = await this.authService.signup(dto)
	res.cookie('user_token', tokens.access_token, {
      expires: new Date(Date.now() + 3600000),
    });
    return {};
  }

  @Post('signin')
  async signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}

// async logout(@Res({ passthrough: true }) res) {
//     res.cookie('user_token', '', { expires: new Date(Date.now()) });
//     return {};
//   }
