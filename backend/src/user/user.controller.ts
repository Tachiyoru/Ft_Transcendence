import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "../auth/decorator";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";
import { TokenGuard } from "../auth/guard/token.guard";
import { FilesInterceptor } from "@nestjs/platform-express";

@UseGuards(TokenGuard)
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get("mee")
  getMePlus(@GetUser() user: User) {
	const update = this.userService.getMePlus(user.id);
    return update;
  }

  @Get("all")
  getAllUsers(@GetUser() user: User) {
    return this.userService.getAllUsers(user.id);
  }

  @Get("all-online")
  getAllOnlineUsers() {
    return this.userService.getAllOnlineUsers();
  }

  @Delete("delete-user")
  deleteUser(@GetUser("id") userId: number) {
    return this.userService.deleteUser(userId);
  }

  @Patch("delete-avatar")
  deleteAvatar(@GetUser("id") userId: number) {
    return this.userService.deleteAvatar(userId);
  }

  @Patch("add-avatar")
  @UseInterceptors(FilesInterceptor("image"))
  uploadFile(
    @GetUser() user: User,
    @UploadedFiles() file: Express.Multer.File[]
  ) {
    const filepath = file[0].path;
    this.userService.editAvatar(user.id, filepath);
    return (filepath)
  }

  @Patch("edit")
  editUser(@GetUser("id") userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Get("histo")
  getHisto(@GetUser() user: User) {
	const histo = this.userService.getHisto(user.id);
	return this.userService.getHisto(user.id);
  }

  @Get("ranking-global")
  getRankingGlobal() {
    return this.userService.getRankingGlobal();
  }


  @Get("ranking-friends")
  getRankingFriendsHim(@Body() userId: number) {
    return this.userService.getRankingFriends(userId);
  }

  @Get("ranking-friends/:name")
  getRankingFriends(@Param("name") name: string) {
    return this.userService.getRankingFriendsHim(name);
  }

  @Get("him/:name")
  getHim(@Param("name") name: string) {
    return this.userService.getHim(name);
  }

  @Get("him/:name/histo")
  getHisHisto(@Param("name") name: string) {
    return this.userService.getHim(name);
  }
}
