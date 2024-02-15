import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game, User } from '@prisma/client';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { SocketTokenGuard } from "src/auth/guard/socket-token.guard";
import { UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { Socket } from 'socket.io';
import { disconnect } from 'process';
import { delay } from 'rxjs';
import { IsNumber, isNumber } from 'class-validator';

@WebSocketGateway({
	cors: { origin: process.env.REACT_APP_URL_FRONTEND, credentials: true },
})
@UseGuards(SocketTokenGuard)
export class GameGateway
{
	@WebSocketServer() server: Server;

	constructor(
		private gameService: GameService,
		private readonly prisma: PrismaService) {};

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
	)
	{
		const gameDB = await this.prisma.game.create({ data: {} });
		this.gameService.createGame(gameDB.gameId, player1User.id, player1Socket, player2User, player2Socket);
	}

	@SubscribeMessage("start")
	async startGameSession(
		@ConnectedSocket() client: Socket,
		@Request() req: any
	)
	{
		const game = await this.gameService.prepareQueListGame(client, req);
		// console.log(game);
		if (game)
		{
			this.server.to(game.player1.playerSocket).emit("CreatedGame", game);
			this.server.to(game.player2.playerSocket).emit("CreatedGame", game);
		}
	}

	@SubscribeMessage("createInviteGame")
	async createInviteGame(
		@MessageBody() invitedId: number,
		@ConnectedSocket() client: Socket,
		@Request() req: any
	)
	{
		const game = await this.gameService.createInviteGame(invitedId, client, req);
		client.emit("gameInviteData", game);
		return (game);
	}

	@SubscribeMessage("checkInvitedGame")
	async checkInvitedGame(
		@MessageBody() hostId: number,
		@ConnectedSocket() client: Socket,
		@Request() req: any
	)
	{
		const game = await this.gameService.checkInvitedGame(hostId, client, req);
		if (game && game.invitedSocket && game.status === 1)
		{
			console.log("Game found");
			const invitedUser = await this.prisma.user.findUnique({
				where: { id: game.invitedId }
			});
			if (!invitedUser)
				throw new Error("User not found");
			const gameDB = await this.prisma.game.create({ data: {} });
			const gameSession = await this.gameService.createGame(gameDB.gameId, hostId, game.hostSocket, invitedUser, game.invitedSocket);
			if (gameSession)
			{
				this.server.to(gameSession.player1.playerSocket).emit("CreatedGame", gameSession);
				this.server.to(gameSession.player2.playerSocket).emit("CreatedGame", gameSession);
				await this.gameService.removeGameInvite(game.gameInviteId);
			}
			return gameSession;
		}
		else
		{
			console.log("Game not found");
			return (null);
		}
	}

	@SubscribeMessage("removeGameInvite")
	async removeGameInvite(@MessageBody() gameInviteId: number)
	{
		console.log("deleting gameInvite : ", gameInviteId);
		await this.gameService.removeGameInvite(gameInviteId);
		const gameDeleted = await this.prisma.gameInvite.findFirst({
			where: { gameInviteId: gameInviteId }
		});
	}

	@SubscribeMessage("getAllGameInvites")
	async getAllGameInvites()
	{
		return (this.gameService.getAllGameInvite());
	}

	// @SubscribeMessage("createInviteGame")
	// async createInviteGame(
	// 	@ConnectedSocket() client: Socket,
	// 	@Request() req: any
	// )
	// {
	// 	const game = await this.gameService.createInviteGame(client, req);
	// }

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
	)
	{
		const game = await this.gameService.findGame(gameSocket);
		if (game)
		{
			this.server.to(game.player1.playerSocket).emit("findGame", game);
			this.server.to(game.player2.playerSocket).emit("findGame", game);
		}
	}

	@SubscribeMessage("setGoalsToWin")
	async setGoalsToWin(
		@MessageBody('gameSocket') gameSocket: string,
		@MessageBody('goalsToWin') goalsToWin: number,
	)
	{
		const game = await this.gameService.findGame(gameSocket);
		if (game)
		{
			game.goalsToWin = goalsToWin;
			this.server.to(game.player1.playerSocket).emit("goalsToWin", game);
			this.server.to(game.player2.playerSocket).emit("goalsToWin", game);
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


      @SubscribeMessage("launchBall")
      async LaunchBall(
        @Request() req: any,
        )
        {
          const game = await this.gameService.LaunchBall(req);
          if (game)
          {
            console.log(game.ball.z);
            let velocity = [0.01, 0];
            delay(50)
            var i = setInterval(async () => {
              game.ball.z += (100 * velocity[0]);
              game.ball.x += velocity[1];
              
              if (game.pScore[0] == 3 || game.pScore[1] == 3) {
                clearInterval(i);
              }
              const collideRet = await this.gameService.collide(game);
              
              console.log(collideRet);
              switch (collideRet) {
                case  0:
                  break;
                case  1:
                  if (velocity[1] >= 0)
                    velocity[1] = -1;
                  velocity[0] *= -1;
                  break;
                case  2:
                  velocity[0] *= -1;
                  break;
                case  3:
                  if (velocity[1] <= 0)
                    velocity[1] = 1;
                  velocity[0] *= -1;
                  break;
                case  4:
                  if (velocity[1] <= 0)
                    velocity[1] = 1;
                  velocity[0] *= -1;
                  break;
                case  5:
                  velocity[0] *= -1;
                  break;
                case  6:
                  if (velocity[1] >= 0)
                    velocity[1] = -1;
                  velocity[0] *= -1;
                  break;
                case  7:
                  velocity[1] *= -1;
                  break;
                case  8:
                  velocity[1] *= -1;
                  break;
                case  9:
                  if (game.ball.z <= -100)  {
                    ++game.pScore[0];
                    game.resetBallPosition();
                    velocity[1] = 0;
                    this.server.to(game.player1.playerSocket).emit("gamescore", game.pScore);
                    this.server.to(game.player2.playerSocket).emit("gamescore", game.pScore);
                  }
                  break;
                case  10:
                  if (game.ball.z >= 100)  {
                    ++game.pScore[1];
                    game.resetBallPosition()
                    velocity[1] = 0;
                    this.server.to(game.player1.playerSocket).emit("gamescore", game.pScore);
                    this.server.to(game.player2.playerSocket).emit("gamescore", game.pScore);
                  }
                  break;
              }
              this.server.to(game.player1.playerSocket).emit("findposball", game.ball);
              this.server.to(game.player2.playerSocket).emit("findposball", game.ball);

              this.server.to(game.player1.playerSocket).emit("findpos", game.paddle);
              this.server.to(game.player2.playerSocket).emit("findpos", game.paddle);
          }, 50);
        }
      }

      // @SubscribeMessage("launchBall")
      // async LaunchBall(
      //   @Request() req: any,
      //   )
      //   {
      //     const game = await this.gameService.LaunchBall(req);
      //     if (game)
      //     {
      //       let velocity = [0.01, 0];
      //       delay(50)
      //       var i = setInterval(() => {
      //         game.ball.z += (game.ball.z * velocity[0]);
      //         game.ball.x += velocity[1];
              
      //         // console.log(game.paddle[1].x)
      //         // if (game.pScore[0] == 3 || game.pScore[1] == 3) {
      //         //   clearInterval(i); // Arrête l'intervalle lorsque la condition est vraie
      //         // }
      //         // }, 50); 
      //         if (Math.floor(game.ball.x) === 60 || Math.floor(game.ball.x) === -60)
      //           velocity[1] *= -1;
      //         else if
      //         (
      //           (Math.floor(game.ball.z) < -227 && Math.floor(game.ball.x) === Math.floor(game.paddle[1].x + 31 / 2)) ||
      //           (Math.floor(game.ball.z) > -58 && Math.floor(game.ball.x) === Math.floor(game.paddle[0].x + 31 / 2))
      //         )
      //         {
      //               velocity[0] *= -1;
      //               velocity[1] = 1 ;
      //         }
      //         else if
      //         (
      //           (Math.floor(game.ball.z) < -227 && Math.floor(game.ball.x) === Math.floor(-game.paddle[1].x + 31 / 2)) ||
      //           (Math.floor(game.ball.z) > -58 && Math.floor(game.ball.x) === Math.floor(-game.paddle[0].x + 31 / 2))
      //         )
      //         {
      //               velocity[0] *= -1;
      //               velocity[1] = -1;
      //         } 
      //         else if (
      //           ((Math.floor(game.ball.z) < -227 && Math.floor(game.ball.x - game.paddle[1].x) <= 31 / 2) ||
      //           (Math.floor(game.ball.z) > -58 && Math.floor(game.ball.x - game.paddle[0].x) <= 31 / 2))
      //         )
      //             velocity[0] *= -1;
      //         else if (Math.abs(game.ball.z) > -232 || Math.abs(game.ball.z) < -58) {
      //           console.log(game.ball.z);
      //           if (game.ball.z < -232) {
      //               ++game.pScore[0];
      //               game.resetBallPosition();
      //               velocity[1] = 0;
      //               this.server.to(game.player1.playerSocket).emit("gamescore", game.pScore);
      //               this.server.to(game.player2.playerSocket).emit("gamescore", game.pScore);
      //           }
      //           else if ((game.ball.z > -58)){
      //               ++game.pScore[1];
      //               game.resetBallPosition()
      //               velocity[1] = 0;
      //               this.server.to(game.player1.playerSocket).emit("gamescore", game.pScore);
      //               this.server.to(game.player2.playerSocket).emit("gamescore", game.pScore);
      //           }
      //         }
              
      //         this.server.to(game.player1.playerSocket).emit("findposball", game.ball);
      //         this.server.to(game.player2.playerSocket).emit("findposball", game.ball);

      //         this.server.to(game.player1.playerSocket).emit("findpos", game.paddle);
      //         this.server.to(game.player2.playerSocket).emit("findpos", game.paddle);
      //       }, 50);
      //     }
      // }

	@SubscribeMessage("movesInputs")
	async movesInputs(
		@ConnectedSocket() client: Socket,
		@MessageBody('gameSocket') gameSocket: string,
		@MessageBody('move') move: string,
		@MessageBody('upDown') upDown: boolean
	)
	{
		const game = await this.gameService.movesInputs(gameSocket, client.id, move, upDown, this.server);
	}

	handleConnection(client: any, ...args: any[])
	{
		console.log(`Game Client connected: ${client.id}`);
	}

	handleDisconnect(client: any)
	{
		console.log(`Client disconnected: ${client.id}`);
	}



	// @SubscribeMessage('start_game')
	// handleGameStart(client: any, payload: any): void {

}

