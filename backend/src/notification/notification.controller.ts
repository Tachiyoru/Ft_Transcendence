import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TokenGuard } from 'src/auth/guard';
import { NotificationService } from './notification.service';
import { GetUser } from 'src/auth/decorator';
import { Notification, User } from '@prisma/client';
import { CreateNotificationDto } from './dto/create-notification.dto';

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

	// test only, delete after
	@Get('all')
	async getAllNotifications(): Promise<Notification[]>
	{
		return (this.notificationService.getAllNotifications());
	}

	@Post('add')
	async addNotification(@GetUser() user: User, @Body() notificationDto: CreateNotificationDto, @Body('type', ParseIntPipe) notifType: number): Promise<Notification>
	{
		return (this.notificationService.addNotification(user, notificationDto, notifType));
	}

	@Delete('delete/:id')
	async deleteNotificationById(@GetUser() user: User, @Param('id', ParseIntPipe) notificationId: number)
	{
		return (this.notificationService.deleteNotificationById(user, notificationId));
	}

	@Patch('read/:id')
	async setNotificationReadById(@GetUser() user: User, @Param('id', ParseIntPipe) notificationId: number): Promise<Notification>
	{
		return (this.notificationService.setNotificationReadById(user, notificationId));
	}

	@Get(':id')
	async getNotificationsById(@Param('id', ParseIntPipe) userId: number): Promise<Notification[]>
	{
		return (this.notificationService.getNotificationsById(userId));
	}
}
