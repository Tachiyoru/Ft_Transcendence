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

	async pendingList(userId: number)
	{
		const user = await this.prismaService.user.findUnique(
		{
			where : {id: userId},
			include: { pendingList: true},
		}
		)
		if (user)
			return user.pendingList;
		return null;
	}

	async getUsersWithMeInPendingList(user: User) {
		const users = await this.prismaService.user.findMany(
		{
			where: {
			pendingList: {
				some: {
				id: user.id,
				},
			},
			},
	});

	return users;
	}

	
	async acceptRequest(user: User, friendId: number) 
	{
		await this.prismaService.user.update(
			{
				where: { id: user.id },
				data: {pendingList: {disconnect: { id: friendId }}}
			}
		);
		await this.prismaService.user.update(
			{
				where: { id: user.id },
				include: { friends : true },
				data: { friends: { connect: { id: friendId }}}
			}
		);
		user = await this.prismaService.user.update(
			{
				where: { id: friendId },
				include: { friends : true },
				data: { 
					friends: { connect: { id: user.id }}
				}
			}
		);

		const notificationDto = new CreateNotificationDto();
		if (user.username)
			notificationDto.fromUser = user.username;

		await this.notificationService.addNotificationByUserId(
			user.id,
			notificationDto,
			NotificationType.FRIENDREQUEST_ACCEPTED
		);

		return (user);
	}

	async rejectRequest(user: User, friendId: number) 
	{
		await this.prismaService.user.update(
			{
				where: { id: user.id },
				data: {pendingList: {disconnect: { id: friendId }}}
			}
		);

		user = await this.prismaService.user.update(
		{
			where: { id: friendId },
			data: {pendingList: {disconnect: { id: user.id }}}
		}
		);

		return user;
	}

	async friendRequest(user: User, friendId: number)
	{
		const friend = await this.prismaService.user.findUnique(
		{
			where: { id: friendId },
			include: { pendingList: true },
		}
		);
		if (!friend) {throw new Error('Friend not found.');}
		
		await this.prismaService.user.update(
		{
			where: { id: friendId },
			data: { pendingList: {connect: { id: user.id },},},
		}
		);

		const notificationDto = new CreateNotificationDto();
		if (user.username) notificationDto.fromUser = user.username;

		await this.notificationService.addNotificationByUserId(
			friendId,
			notificationDto,
			NotificationType.FRIENDREQUEST_RECEIVED
		);

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

		await this.prismaService.user.update({
			where: { id: friendId },
			data: {
			friends: {
			disconnect: { id: user.id },
			},
		},
		include: { friends: true },
		});

		return (user);
	}

	async blockUser(user: User, blockedUserId: number)
	{
		user = await this.prismaService.user.update({
			where: { id: user.id },
			data: {
			blockedList: {
				connect: { id: blockedUserId },
			},
			},
		});
			return (user);
	}
		
	async unblockUser(user: User, unblockedUserId: number)
	{
		user =await this.prismaService.user.update({
			where: { id: user.id },
			data: {
			blockedList: {
				disconnect: { id: unblockedUserId },
			},
			},
		});
		return (user);
	}

	async getBlockedUsers(user: User)
	{
		const me = await this.prismaService.user.findUnique({
			where: { id: user.id },
			include: {
			blockedList: true,
			},
		});
		
		if (!me) {
			throw new Error('User not found');
		}
		
		return me.blockedList;
	}

	async getMyFriends(user: User) {
		const me = await this.prismaService.user.findUnique({
			where: { id: user.id },
			include: {
			friends: true,
			blockedList: true,
			},
		});
		
		if (!me) {
			throw new Error('User not found');
		}
		
		const blockedUserIds = me.blockedList.map(user => user.id);
		const filteredFriends = me.friends.filter(friend => !blockedUserIds.includes(friend.id));
		
		return filteredFriends;
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
