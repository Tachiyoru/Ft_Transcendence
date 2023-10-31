import { IsAlpha, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
