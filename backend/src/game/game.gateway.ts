import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game } from '@prisma/client';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { SocketTokenGuard } from "src/auth/guard/socket-token.guard";
import { UseGuards, Request } from '@nestjs/common';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: "http://localhost:5173", credentials: true },
})
@UseGuards(SocketTokenGuard)
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private gameService: GameService,
    private readonly prisma: PrismaService) {};

  afterInit(server: Server) {
    console.log('Init');
  }

  @SubscribeMessage("saucisse")
  async connection(
    @ConnectedSocket() client : Socket,
    @Request() req: any
  ) {
    console.log("Player : " + client.id + " connected to the game.")
    console.log(client);
    const gameReady = await this.gameService.connection(client, req);
    if (gameReady)  {
      this.server.to(gameReady.player1).emit('GameFull');
      this.server.to(gameReady.player2).emit('GameFull');
    }
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }
  
  @SubscribeMessage('start_game')
  handleGameStart(client: any, payload: any): void {
    
  }
}
