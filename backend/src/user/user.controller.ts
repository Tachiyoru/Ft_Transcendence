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
    @GetUser("id") userId: number,
    @UploadedFiles() file: Express.Multer.File[]
  ) {
    console.log("file : ");
    const filepath = file[0].path;
    this.userService.editAvatar(userId, filepath);
  }

  @Patch("edit")
  editUser(@GetUser("id") userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Get("ranking-global")
  getRankingGlobal() {
    return this.userService.getRankingGlobal();
  }

  @Get("ranking-friends")
  getRankingFriends(@Body() userId: number) {
    return this.userService.getRankingFriends(userId);
  }

  @Get("him/:name")
  getHim(@Param("name") name: string) {
    return this.userService.getHim(name);
  }
}
