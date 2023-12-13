import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { TokenGuard } from 'src/auth/guard';
import { NotificationService } from './notification.service';
import { GetUser } from 'src/auth/decorator';
import { Notification, User } from '@prisma/client';

@Controller('notification')
@UseGuards(TokenGuard)
export class NotificationController
{
	constructor(private notificationService: NotificationService) {}

	@Get('mine')
	async getMyNotifications(@GetUser() user: User): Promise<Notification[]>
	{
		return (this.notificationService.getMyNotifications(user));
	}


	@Post('add')
	async addNotification(@GetUser() user: User): Promise<Notification>
	{
		return (this.notificationService.addNotification(user));
	}

	@Get(':id')
	async getNotificationsById(@Param('id', ParseIntPipe) userId: number): Promise<Notification[]>
	{
		return (this.notificationService.getNotificationsById(userId));
	}
}
