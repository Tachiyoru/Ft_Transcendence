import { Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { TokenGuard } from 'src/auth/guard';
import { FriendsListService } from './friends-list.service';


@Controller("friends-list")
export class FriendsListController
{
	constructor(private friendListService: FriendsListService) {}

	@Post("add/:userId/:friendId")
	addFriend(@Param('userId', ParseIntPipe) userId: number, @Param('friendId', ParseIntPipe) friendId: number)
	{
		return (this.friendListService.addFriend(userId, friendId));
	}

	@Delete("remove/:userId/:friendId")
	removeFriend(@Param('userId', ParseIntPipe) userId: number, @Param('friendId', ParseIntPipe) friendId: number)
	{
		return (this.friendListService.removeFriend(userId, friendId));
	}
}
