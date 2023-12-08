import { Injectable, Req } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsListService
{
	constructor(private prismaService: PrismaService) {}

	async addFriend(user: User, friendId: number)
	{
		const friend = await this.prismaService.user.findUnique({
			where: {
				id: friendId,
			},
			include: {
				friends: true,
			},
		});

		if (!user || !friend)
			throw new Error('User not found');

		user = await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				friends: {
					connect: { id: friendId },  // Connectez l'ami existant
				},
			},
			include: { friends: true },  // Inclure les amis dans la réponse
		});

		return (user);
	}

	async removeFriend(user: User, friendId: number)
	{
		const friend = await this.prismaService.user.findUnique({
			where: {
				id: friendId,
			},
			include: {
				friends: true,
			},
		});

		if (!user || !friend)
			throw new Error('User not found');

		user = await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				friends: {
					disconnect: { id: friendId },
				},
			},
			include: { friends: true },
		});

		return (user);
	}

	async getAllFriends(user: User)
	{
		const update = await this.prismaService.user.findUnique({
			where: { id: user.id },
			include: { friends: true },
		});
		if (!update)
			throw new Error('User not found');
		return (update.friends)
	}
}
