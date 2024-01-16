import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketTokenGuard } from 'src/auth/guard/socket-token.guard';
import { NotificationService } from './notification.service';

@WebSocketGateway({
	cors: { origin: "http://localhost:5173", credentials: true },
})
@UseGuards(SocketTokenGuard)
export class NotificationGateway implements OnGatewayConnection
{
	constructor(
		private notificationService: NotificationService
	) {}
	@WebSocketServer() server: Server;

	handleConnection(client: Socket)
	{}

	@SubscribeMessage('unread-notification')
	async sendUnreadNotification(@ConnectedSocket() client: Socket)
	{
		const unreadNotifications = await this.notificationService.getUnreadNotifications(client.handshake.auth.id);
		this.server.emit('unread-notification-array', unreadNotifications);
	}
}
