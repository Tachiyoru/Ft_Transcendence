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

		// if (!me.notifications)
		// {
		// 	return (me.notifications = []);
		// }

		// const notifications = await this.prismaService.notification.findMany({
		// 	where: {
		// 		userId: user.id,
		// 	},
		// });

		return (me.notifications);
	}
}
