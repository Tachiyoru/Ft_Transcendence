import { Injectable, Req } from "@nestjs/common";
import { User } from "@prisma/client";
import { NotificationType } from "src/notification/content-notification";
import { CreateNotificationDto } from "src/notification/dto/create-notification.dto";
import { NotificationService } from "src/notification/notification.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FriendsListService
{
	constructor(
		private prismaService: PrismaService,
		private notificationService: NotificationService
	) {}

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
			throw new Error("User not found");

		user = await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				friends: {
					connect: { id: friendId }, // connect existing friend
				},
			},
			include: { friends: true }, // inlcude friends in the response
		});

		const notificationDto = new CreateNotificationDto();
		if (user.username)
			notificationDto.fromUser = user.username;

		this.notificationService.addNotificationByUserId(friendId, notificationDto, NotificationType.FRIENDREQUEST_RECEIVED);

		return user;
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

		if (!user || !friend) throw new Error("User not found");

		user = await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				friends: {
					disconnect: { id: friendId },
				},
			},
			include: { friends: true },
		});

		return user;
	}

	async getMyFriends(user: User)
	{
		const me = await this.prismaService.user.findUnique({
			where: { id: user.id },
			include: { friends: true },
		});
		if (!me)
			throw new Error("User not found");
		return me.friends;
	}

	async getNonFriends(user: User)
	{
		const me = await this.prismaService.user.findUnique({
			where: { id: user.id },
			include: {
				friends: true,
			},
		});

		if (!me) throw new Error("User not found");

		const friendIds = me.friends.map((friend) => friend.id);
		console.log(friendIds);

		const nonFriends = await this.prismaService.user.findMany({
			where: {
				id: { notIn: [user.id, ...friendIds] },
			},
		});
		return nonFriends;
	}

	async getFriendsFrom(userId: number)
	{
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
			include: { friends: true },
		});
		if (!user) throw new Error("User not found");
		return user.friends;
	}
}
