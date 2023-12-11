import { Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { FriendsListService } from './friends-list.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { TokenGuard } from 'src/auth/guard';
import { TokenGuardTwo } from 'src/auth/guard/token-2.guard';
import { channel } from 'diagnostics_channel';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller("friends-list")
@UseGuards(TokenGuardTwo)
export class FriendsListController
{
	constructor(private friendListService: FriendsListService,
		private readonly prismaService: PrismaService) {}

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

	@Get("all")
	async getAllFriends(@GetUser() user: User): Promise<User[]>
	{
		return (this.friendListService.getAllFriends(user));
	}
}
