import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsListService
{
	constructor(private prismaService: PrismaService) {}

	async addFriend(@GetUser() user: User, friendId: number)
	{
		console.log({ user });

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
					disconnect: { id: friendId },  // Déconnectez l'ami existant
				},
			},
			include: { friends: true },  // Inclure les amis dans la réponse
		});

		return (user);
	}
}
