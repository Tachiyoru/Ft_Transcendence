import { IsAlpha, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
