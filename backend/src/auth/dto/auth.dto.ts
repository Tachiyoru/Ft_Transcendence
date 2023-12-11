import { IsAlpha, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto
{
	@IsNotEmpty()
	@IsAlpha()
	username: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}

export class AuthDto2
{
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}
