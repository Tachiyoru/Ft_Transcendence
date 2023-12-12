import {
  Body,
  Controller,
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
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(TokenGuard)
  @Get("me")
  getMe(@GetUser() user: User) {
    console.log(user);
    return user;
  }

  @Get("all")
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch("addAvatar")
  @UseInterceptors(FilesInterceptor("image"))
  uploadFile(
    @GetUser("id") userId: number,
    @UploadedFiles() file: Express.Multer.File[]
  ) {
    console.log("file =", file[0].path);
    const filepath = file[0].path;
    this.userService.editAvatar(userId, filepath);
  }

  @UseGuards(TokenGuard)
  @Patch("edit")
  editUser(@GetUser("id") userId: number, @Body() dto: EditUserDto) {
    console.log("userId : ", userId);
    return this.userService.editUser(userId, dto);
  }
}
