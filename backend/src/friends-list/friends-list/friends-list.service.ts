import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsListService
{
	constructor(private prismaService: PrismaService) {}

	async addFriend(userId: number, friendId: number)
	{
		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				friends: true,
			},
		});

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

		const updatedUser = await this.prismaService.user.update({
			where: { id: userId },
			data: {
				friends: {
					connect: { id: friendId },  // Connectez l'ami existant
				},
			},
			include: { friends: true },  // Inclure les amis dans la réponse
		});

		return (updatedUser);
	}

	async removeFriend(userId: number, friendId: number)
	{
		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				friends: true,
			},
		});

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

		const updatedUser = await this.prismaService.user.update({
			where: { id: userId },
			data: {
				friends: {
					disconnect: { id: friendId },  // Déconnectez l'ami existant
				},
			},
			include: { friends: true },  // Inclure les amis dans la réponse
		});

		return (updatedUser);
	}
}
