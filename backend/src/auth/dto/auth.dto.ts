import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Length(6, 7 ,{message: 'error'})
  @IsNotEmpty({message: 'error'})
  @IsString()
  password: string;
}
