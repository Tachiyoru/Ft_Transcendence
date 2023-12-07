import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "../auth/decorator";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";
import { TokenGuard } from "src/auth/guard/token.guard";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}


  @UseGuards(TokenGuard)
  @Get("me")
  getMe(@GetUser() user: User) {
	console.log("aaaaaaaaaaaaaaaa");
    return user;
  }

  @UseGuards(TokenGuard)
  @Patch()
  editUser(@GetUser("id") userId: number, @Body() dto: EditUserDto) {
	//peut etre save des maintenant l'image et recup l'URL et la send dans edit 57:00 
    return this.userService.editUser(userId, dto);
  }
}
