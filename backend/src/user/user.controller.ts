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

  @Post("addAvatar")
  @UseInterceptors(FilesInterceptor("image"))
  uploadFile(@UploadedFiles() file: Express.Multer.File) {
    console.log(file);
  }

  @UseGuards(TokenGuard)
  @Patch("edit")
  editUser(@GetUser("id") userId: number, @Body() dto: EditUserDto) {
    console.log("userId : ", userId);
    return this.userService.editUser(userId, dto);
  }
}
