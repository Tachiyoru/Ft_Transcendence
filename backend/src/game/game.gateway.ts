import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game, User } from '@prisma/client';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { SocketTokenGuard } from "src/auth/guard/socket-token.guard";
import { UseGuards, Request, ParseIntPipe} from '@nestjs/common';
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

  @SubscribeMessage("createGame")
  async createGameDB(
    player1User: User,
    player1Socket: string,
    player2User: User,
    player2Socket: string,
    @Request() req: any
  )  {
    const gameDB = await this.prisma.game.create({data: {}});
    this.gameService.createGame(gameDB.gameId, player1User, player1Socket, player2User, player2Socket);
  }

  @SubscribeMessage("start")
  async startGameSession(
    @ConnectedSocket() client: Socket,
    @Request() req: any
  ) {
    const game = await this.gameService.prepareQueListGame(client, req);
    if (game)
    {
      this.server.to(game.player1.playerSocket).emit("CreatedGame", game);
      this.server.to(game.player2.playerSocket).emit("CreatedGame", game);
    }

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
  // }

    @SubscribeMessage("findGame")
    async gamestart(
      @MessageBody('gameSocket') gameSocket: string,
    ) {
      const game = await this.gameService.findGame(gameSocket);
      if  (game)
      {
        this.server.to(game.player1.playerSocket).emit("findGame", game);
        this.server.to(game.player2.playerSocket).emit("findGame", game);
      }
    }

    @SubscribeMessage("verifyGame")
    async verifyGame(
      @MessageBody('gameSocket') gameSocket: string,
      @MessageBody('userId') userId: number,
      @ConnectedSocket() client: Socket,
      )
      {
        const boolean = await this.gameService.verifyGame(gameSocket, client, userId);
        const game = await this.gameService.findGame(gameSocket);
        if (game)
        {
          this.server.to(game.player1.playerSocket).emit("verifyGame", boolean);
          this.server.to(game.player2.playerSocket).emit("verifyGame", boolean);
        }
      }

      @SubscribeMessage("notInGame")
      async notInGame(
        @Request() req: any
        )
        {
          const data = await this.gameService.notInGame(req);
          if (data.game)
          {
            this.server.to(data.game.player1.playerSocket).emit("verifyGame", data.boolean);
            this.server.to(data.game.player2.playerSocket).emit("verifyGame", data.boolean);
            data.game.destroyGame(this.prisma);
          }
        }

      @SubscribeMessage("movesInputs")
      async movesInputs(
      @ConnectedSocket() client: Socket,
      @MessageBody('gameSocket') gameSocket : string,
      @MessageBody('move') move : string,
      @MessageBody('upDown') upDown : number
      ) {
        const game = await this.gameService.movesInputs(gameSocket, client.id, move, upDown);
        if (game)
        {
          this.server.to(game.player1.playerSocket).emit("findGame", game);
          this.server.to(game.player2.playerSocket).emit("findGame", game);
        }
      }
        



  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }
  
  // @SubscribeMessage('start_game')
  // handleGameStart(client: any, payload: any): void {
    
  }

