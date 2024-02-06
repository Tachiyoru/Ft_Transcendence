import { Body, UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketTokenGuard } from 'src/auth/guard/socket-token.guard';
import { NotificationService } from './notification.service';

@WebSocketGateway({
	cors: { origin: process.env.REACT_APP_URL_FRONTEND, credentials: true },
})
@UseGuards(SocketTokenGuard)
export class NotificationGateway
{
	constructor(
		private notificationService: NotificationService
	) {}
	@WebSocketServer() server: Server;

	afterInit()
	{
		this.server.on("connection", (socket) =>
		{
			console.log("cooooooooooooonnected as socket :", socket.id);
		});

	}

	@SubscribeMessage('unread-notification')
	async sendUnreadNotification(@ConnectedSocket() client: Socket)
	{
		const unreadNotifications = await this.notificationService.getUnreadNotifications(client.handshake.auth.id);
		this.server.to(client.id).emit('unread-notification-array', unreadNotifications);
	}

	@SubscribeMessage('update-notification-number')
	async updateNotificationNumber(
		@ConnectedSocket() client: Socket,
		@Body('notifId') notifId: number
	)
	{
		const unreadNotifications = await this.notificationService.updateNumber(notifId, client.handshake.auth.id);
		this.server.to(client.id).emit('unread-notification-array', unreadNotifications);
	}
}
