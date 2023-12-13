import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationContentType, NotificationContentFunctions } from './content-notification';

@Injectable()
export class NotificationService
{
	constructor(private prismaService: PrismaService) {}

	async getMyNotifications(user: User)
	{
		const me = await this.prismaService.user.findUnique({
			where: { id: user.id },
			include: { notifications: true },
		});

		if (!me)
			throw new Error('User not found');

		return (me.notifications);
	}

	async getNotificationsById(userId: number)
	{
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
			include: { notifications: true },
		});

		if (!user)
			throw new Error('User not found');

		return (user.notifications);
	}

	// envoyer type de notification + dto contenant EVENTUELLEMENT les infos necessaires pour certaines notifs seulement, avec le type, retrouver le content de la notif, et rajouter la notif contenant le type (plus vraiment necesssaire a part pour cote front peut etre) et le content dans user.notifications
	async addNotification(user: User, notificationDto: CreateNotificationDto, notifType: number)
	{
		const me = await this.prismaService.user.findUnique({
			where: { id: user.id },
			include: { notifications: true },
		});

		if (!me)
			throw new Error('User not found');

		const updatedContent = this.setContentInNotification(notifType, notificationDto);

		const notification = this.prismaService.notification.create({
			data: {
				user: {
					connect: {
						id: user.id,
					},
				},
				type: notifType,
				content: updatedContent,
			},
		});
		// console.log(notification);
		return (notification);
	}

	setContentInNotification(notifType: number, notificationDto: CreateNotificationDto)
	{
		const contentGenerator = NotificationContentFunctions[notifType as NotificationContentType];

		if (notifType === NotificationContentType.FRIENDREQUEST_RECEIVED
			|| notifType === NotificationContentType.FRIENDREQUEST_ACCEPTED
			|| notifType === NotificationContentType.INVITED_TO_GAME)
		{
			if (!notificationDto.fromUser)
				throw new Error('Missing fromUser in notificationDto');
			const content = contentGenerator(notificationDto.fromUser);
			console.log(content);
			return (content);
		}
		else if (notifType === NotificationContentType.ACHIEVEMENT_UNLOCKED)
		{
			if (!notificationDto.achievementName)
				throw new Error('Missing achievementName in notificationDto');
			const content = contentGenerator(notificationDto.achievementName);
			console.log(content);
			return (content);
		}
		else if (notifType === NotificationContentType.INVITED_TO_CHANNEL
			|| notifType === NotificationContentType.INTEGRATED_TO_CHANNEL)
		{
			if (!notificationDto.fromUser)
				throw new Error('Missing fromUser in notificationDto');
			if (!notificationDto.channelName)
				throw new Error('Missing channelName in notificationDto');
			const content = contentGenerator(notificationDto.fromUser, notificationDto.channelName);
			console.log(content);
			return (content);
		}
		else if (notifType === NotificationContentType.CHANNEL_PRIVILEGE_GRANTED)
		{
			if (!notificationDto.privilegeName)
				throw new Error('Missing privilegeName in notificationDto');
			if (!notificationDto.channelName)
				throw new Error('Missing channelName in notificationDto');
			const content = contentGenerator(notificationDto.privilegeName, notificationDto.channelName);
			console.log(content);
			return (content);
		}
		else
			throw new Error('Invalid notification type');
	}

	async setNotificationReadById(user: User, notificationId: number)
	{
		const me = await this.prismaService.user.findUnique({
			where: { id: user.id },
			include: { notifications: true },
		});

		if (!me)
			throw new Error('User not found');

		const updatedNotification = await this.prismaService.notification.update({
			where: { id: notificationId },
			data: { read: true },
		});

		return (updatedNotification);
	}

	// For test only, need to delete it after
	async getAllNotifications()
	{
		const notifications = await this.prismaService.notification.findMany();

		return (notifications);
	}

	async deleteNotificationById(user: User, notificationId: number)
	{
		const me = await this.prismaService.user.findUnique({
			where: { id: user.id },
			include: { notifications: true },
		});

		if (!me)
			throw new Error('User not found');

		let deletedNotification = await this.prismaService.notification.findFirst({
			where: { id: notificationId },
		});

		if (!deletedNotification)
			throw new Error('Notification not found');

		deletedNotification = await this.prismaService.notification.delete({
			where: { id: notificationId },
		});

		return (deletedNotification);
	}
}
