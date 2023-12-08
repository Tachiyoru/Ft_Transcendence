import { IsEmail, IsOptional, IsString } from "class-validator";

export class EditUserDto
{
	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	username?: string;

	@IsString()
	@IsOptional()
	password?: string;

	@IsString()
	@IsOptional()
	newPassword?: string;

	@IsString()
	@IsOptional()
	avatar?: string;
}
