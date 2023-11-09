import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
<<<<<<< HEAD
  @IsEmail()
=======
  @IsString()
  @IsAlpha()
>>>>>>> Backend
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
