import
{
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "../auth/decorator";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";
import { TokenGuard } from "../auth/guard/token.guard";
import { FilesInterceptor } from "@nestjs/platform-express";

@UseGuards(TokenGuard)
@Controller("users")
export class UserController
{
	constructor(private userService: UserService) {}

	@Get("me")
	getMe(@GetUser() user: User)
	{
		console.log("users/me", user);
		return user;
	}

	@Get("all")
	getAllUsers()
	{
		return this.userService.getAllUsers();
	}

	@Get("all-online")
	getAllOnlineUsers()
	{
		return this.userService.getAllOnlineUsers();
	}

	@Delete("delete-user")
	deleteUser(@GetUser("id") userId: number)
	{
		return this.userService.deleteUser(userId);
	}

	@Patch("delete-avatar")
	deleteAvatar(@GetUser("id") userId: number)
	{
		return this.userService.deleteAvatar(userId);
	}

	@Patch("add-avatar")
	@UseInterceptors(FilesInterceptor("image"))
	uploadFile(
		@GetUser("id") userId: number,
		@UploadedFiles() file: Express.Multer.File[]
	)
	{
		const filepath = file[0].path;
		this.userService.editAvatar(userId, filepath);
	}

	@Patch("edit")
	editUser(@GetUser("id") userId: number, @Body() dto: EditUserDto)
	{
		console.log("userId : ", userId);
		return this.userService.editUser(userId, dto);
	}

	@Get("ranking-global")
	getRankingGlobal()
	{
		return this.userService.getRankingGlobal();
	}

	@Get("ranking-friends")
	getRankingFriends(@Body() userId: number)
	{
		return this.userService.getRankingFriends(userId);
	}
}
