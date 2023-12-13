import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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

	async addNotification(user: User)
	{
		const me = await this.prismaService.user.findUnique({
			where: { id: user.id },
			include: { notifications: true },
		});

		if (!me)
			throw new Error('User not found');

		return this.prismaService.notification.create({
			data: {
				user: {
					connect: {
						id: user.id,
					},
				},
				type: 'notification_type', // Replace 'notification_type' with the actual type
				content: 'notification_content', // Replace 'notification_content' with the actual content
			},
		});
	}
}
