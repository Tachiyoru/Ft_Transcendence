import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { FriendsListService } from "./friends-list.service";
import { GetUser } from "src/auth/decorator";
import { User } from "@prisma/client";
import { TokenGuard } from "src/auth/guard";

@Controller("friends-list")
@UseGuards(TokenGuard)
export class FriendsListController {
  constructor(private friendListService: FriendsListService) {}

  @Get("mine")
  async getMyFriends(@GetUser() user: User): Promise<User[]> {
    return this.friendListService.getMyFriends(user);
  }

  @Get("non-friends")
  async getNonFriends(@GetUser() user: User): Promise<User[]> {
    return this.friendListService.getNonFriends(user);
  }

  @Get("from/:id")
  async getFriendsFrom(@Param("id", ParseIntPipe) id: number): Promise<User[]> {
    return this.friendListService.getFriendsFrom(id);
  }

  @Post("add/:friendId")
  addFriend(
    @GetUser() user: User,
    @Param("friendId", ParseIntPipe) friendId: number
  ): Promise<User> {
    return this.friendListService.addFriend(user, friendId);
  }

  @Delete("remove/:friendId")
  removeFriend(
    @GetUser() user: User,
    @Param("friendId", ParseIntPipe) friendId: number
  ): Promise<User> {
    return this.friendListService.removeFriend(user, friendId);
  }
}
