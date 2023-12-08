import { Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { FriendsListService } from './friends-list.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { TokenGuard } from 'src/auth/guard';

// Si ca fonctionne plus tard, mettre un guard pour que seul les amis puissent ajouter des amis ??? qu'est ce qu'il me raconte copilot

// Si ca ne fonctionne plus apres, essayer de rajouter TokenGuard qui est peut etre necessaire pour utiliser @GetUser()
@Controller("friends-list")
export class FriendsListController
{
	constructor(private friendListService: FriendsListService) {}

	@UseGuards(TokenGuard)
	@Post("add/:friendId")
	addFriend(@GetUser() user: User, @Param('friendId', ParseIntPipe) friendId: number)
	{
		return (this.friendListService.addFriend(user, friendId));
	}

	@Delete("remove/:friendId")
	removeFriend(@GetUser() user: User, @Param('friendId', ParseIntPipe) friendId: number)
	{
		return (this.friendListService.removeFriend(user, friendId));
	}
}
