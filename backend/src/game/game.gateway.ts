import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game } from '@prisma/client';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { SocketTokenGuard } from "src/auth/guard/socket-token.guard";
import { UseGuards, Request } from '@nestjs/common';
import { Socket } from 'socket.io';
import { disconnect } from 'process';

@WebSocketGateway({
  cors: { origin: process.env.REACT_APP_URL_FRONTEND, credentials: true },
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

  // @SubscribeMessage("saucisse")
  // async connection(
  //   @ConnectedSocket() client : Socket,
  //   @Request() req: any
  // ) {
  //   console.log("Player : " + client.id + " connected to the game.")
  //   const gameReady = await this.gameService.connection(client, req);
  //   if (gameReady)  {
  //     this.server.to(gameReady.player1).emit('GameFull', gameReady);
  //     this.server.to(gameReady.player2).emit('GameFull', gameReady);
  //   }
  //   client.on("disconnect", () => {
  //     console.log("disconnected from server");
  //     this.removeUserFromGame(client)
  //   });
  // }

  @SubscribeMessage("createGameDB")
  async createGameDB(
    @Request() req: any
  )  {
    const gameDB = await this.prisma.game.create({ data: {}})
    //const game = new Game()
    this.server.emit('newGame', gameDB)
  }

  @SubscribeMessage("start")
  async startGameSession(
    @ConnectedSocket() client: Socket,
    @Request() req: any
  ) {
    const ok = await this.gameService.prepareQueListGame(client, req);
    console.log(ok)
  }

  // @SubscribeMessage("gotDisconnected")
  // async removeUserFromGame(
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   console.log("Player : " + client.id + " got disconnected from the game.")
  //   const game = await this.gameService.checkGameUsers(client);
  //   if(game)  {
  //     await this.gameService.removeGame(game?.gameId);
  //     client.emit('GameReset', true);
  //   }
    // if (closeGame)  {
    //   if (closeGame === 'deleted')  {
    //     return (null);
    //   }
    //   else if (!closeGame)  {
    //     return (null);
    //   }
    //   else  {
    //     console.log('ok')
    //     this.server.to(closeGame.player1).emit('GameReset', closeGame);
    //   }
    // }
  // }

  // @SubscribeMessage("gamestart")
  // async gamestart(
  //   @MessageBody("gameSocket") gameSocket: string,
  // ) {
  //   const game = await this.gameService.findGame(gameSocket);
  //   this.server.emit("gamestart", game);
  // }


  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }
  
  // @SubscribeMessage('start_game')
  // handleGameStart(client: any, payload: any): void {
    
  }

