import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
	async getNonFriends(@GetUser() user: User): Promise<User[]>
	{
		return (this.friendListService.getNonFriends(user));
	}

	@Get('/pending-list')
	pendingList(@GetUser() user: User){
		return this.friendListService.pendingList(user.id);
	}

	@Post('/friend-request/:id/accept')
	acceptRequest(@GetUser() user: User, @Param('id') id: string){
		return this.friendListService.acceptRequest(user, +id);
	}

	@Delete('/friend-request/:id/reject')
	rejectRequest(@GetUser() user: User, @Param('id') id: string){
		return this.friendListService.rejectRequest(user, +id);
	}

	@Post('/friend-request/:friendId')
	friendRequest(@GetUser() user: User, @Param('friendId', ParseIntPipe) friendId: number): Promise<User>{
		return this.friendListService.friendRequest(user, friendId);
	}

	// @Delete('/friend-request/:friendId/remove')
	// friendRequestRemove(@GetUser() user: User, @Param('friendId', ParseIntPipe) friendId: number): Promise<User>{
	// 	return this.friendListService.friendRequest(user, friendId);
	// }

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
