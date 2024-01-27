import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { Notification } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { SocketTokenGuard } from 'src/auth/guard/socket-token.guard';
import { NotificationService } from './notification.service';
import { use } from 'passport';
import { TokenGuard } from 'src/auth/guard';

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

	afterInit() {
		this.server.on("connection", (socket) => {
		  console.log("cooooooooooooonnected as socket :", socket.id);
		});
	  }

	@SubscribeMessage('unread-notification')
	async sendUnreadNotification(@ConnectedSocket() client: Socket){
		console.log("unread-notification");
		const unreadNotifications = await this.notificationService.getUnreadNotifications(client.handshake.auth.id);
		this.server.to(client.id).emit('unread-notification-array', unreadNotifications);
	}
}
