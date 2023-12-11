import { Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { FriendsListService } from './friends-list.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { TokenGuardTwo } from 'src/auth/guard/token-2.guard';

@Controller("friends-list")
@UseGuards(TokenGuardTwo)
export class FriendsListController
{
	constructor(private friendListService: FriendsListService) {}

	@Get()
	async getMyFriends(@GetUser() user: User): Promise<User[]>
	{
		return (this.friendListService.getMyFriends(user));
	}

	@Get("from/:id")
	async getFriendsFrom(@Param('id', ParseIntPipe) id: number): Promise<User[]>
	{
		return (this.friendListService.getFriendsFrom(id));
	}

	@Post("add/:friendId")
	addFriend(@GetUser() user: User, @Param('friendId', ParseIntPipe) friendId: number): Promise<User>
	{
		return (this.friendListService.addFriend(user, friendId));
	}

	@Delete("remove/:friendId")
	removeFriend(@GetUser() user: User, @Param('friendId', ParseIntPipe) friendId: number): Promise<User>
	{
		return (this.friendListService.removeFriend(user, friendId));
	}
}
