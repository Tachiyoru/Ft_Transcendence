import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "../auth/decorator";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";
import { TokenGuard } from "../auth/guard/token.guard";

@Controller("users")
export class UserController
{
	constructor(private userService: UserService) {}


	@UseGuards(TokenGuard)
	@Get("me")
	getMe(@GetUser() user: User)
	{
		console.log(user)
		return user;
	}

	@Get("all")
	getAllUsers() {
		return this.userService.getAllUsers();
	}

	@UseGuards(TokenGuard)
	@Patch("edit")
	editUser(@GetUser("id") userId: number, @Body() dto: EditUserDto)
	{
		console.log("userId : ", userId)
		return (this.userService.editUser(userId, dto));
	}
}