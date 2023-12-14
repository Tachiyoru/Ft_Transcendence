import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TokenGuard } from 'src/auth/guard';
import { NotificationService } from './notification.service';
import { GetUser } from 'src/auth/decorator';
import { Notification, User } from '@prisma/client';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { OPTIONAL_PROPERTY_DEPS_METADATA } from '@nestjs/common/constants';

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

	@Post('add/:id')
	async addNotificationByUserId(@Param('id', ParseIntPipe) userId: number, @Body() notificationDto: CreateNotificationDto, @Body('type', ParseIntPipe) notifType: number): Promise<Notification>
	{
		return (this.notificationService.addNotificationByUserId(userId, notificationDto, notifType));
	}

	@Delete('delete/:userId/:id')
	async deleteNotificationById(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) notificationId: number)
	{
		return (this.notificationService.deleteNotificationById(userId, notificationId));
	}

	@Patch('read/:userId/:id')
	async setNotificationReadById(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) notificationId: number): Promise<Notification>
	{
		return (this.notificationService.setNotificationReadById(userId, notificationId));
	}

	@Get(':id')
	async getNotificationsById(@Param('id', ParseIntPipe) userId: number): Promise<Notification[]>
	{
		return (this.notificationService.getNotificationsById(userId));
	}
}
