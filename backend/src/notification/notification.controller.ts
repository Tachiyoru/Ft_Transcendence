import { Controller, Get, UseGuards } from '@nestjs/common';
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

}
