import { WebSocketGateway, SubscribeMessage, WebSocketServer, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { SocketTokenGuard } from "src/auth/guard/socket-token.guard";
import { UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { Socket } from 'socket.io';
import { delay } from 'rxjs';
import { Game } from './game.class';

@WebSocketGateway({
  cors: { origin: process.env.REACT_APP_URL_FRONTEND, credentials: true },
})
@UseGuards(SocketTokenGuard)
export class GameGateway {
  @WebSocketServer() server: Server;

  constructor(
    private gameService: GameService,
    private readonly prisma: PrismaService
  ) {}

  @SubscribeMessage("createGame")
  async createGameDB(
    player1User: User,
    player1Socket: string,
    player2User: User,
    player2Socket: string,
    @Request() req: any
  ) {
    const gameDB = await this.prisma.game.create({ data: {} });
    this.gameService.createGame(
      gameDB.gameId,
      player1User.id,
      player1Socket,
      player2User,
      player2Socket
    );
  }

  @SubscribeMessage("start")
  async startGameSession(
    @ConnectedSocket() client: Socket,
    @Request() req: any
  ) {
    const game = await this.gameService.prepareQueListGame(client, req);
    if (game) {
      this.server.to(game.player1.playerSocket).emit("CreatedGame", game);
      this.server.to(game.player2.playerSocket).emit("CreatedGame", game);
    }
  }

  @SubscribeMessage("createInviteGame")
  async createInviteGame(
    @MessageBody() invitedId: number,
    @ConnectedSocket() client: Socket,
    @Request() req: any
  ) {
    const game = await this.gameService.createInviteGame(
      invitedId,
      client,
      req
    );
    client.emit("gameInviteData", game);
    return game;
  }

  @SubscribeMessage("uncheckInvitedGame")
  async uncheckInvitedGame(
    @MessageBody() hostId: number,
    @ConnectedSocket() client: Socket,
    @Request() req: any
  ) {
		const gameInvite = await this.prisma.gameInvite.findFirst(
			{
				where:
				{
					hostId: hostId,
          invitedId: req.user.id,
				},
			},
		);
    if (gameInvite?.hostSocket)
      this.server.to(gameInvite?.hostSocket).emit('uncheckInvitedGame', true);
  }


  @SubscribeMessage("checkInvitedGame")
  async checkInvitedGame(
    @MessageBody() hostId: number,
    @ConnectedSocket() client: Socket,
    @Request() req: any
  ) {
    const game = await this.gameService.checkInvitedGame(hostId, client, req);
    if (game && game.invitedSocket && game.status === 1) {
      const invitedUser = await this.prisma.user.findUnique({
        where: { id: game.invitedId },
      });
      if (!invitedUser) throw new Error("User not found");
      const gameDB = await this.prisma.game.create({ data: {} });
      const gameSession = await this.gameService.createGame(
        gameDB.gameId,
        hostId,
        game.hostSocket,
        invitedUser,
        game.invitedSocket
      );
      if (gameSession) {
        this.server
          .to(gameSession.player1.playerSocket)
          .emit("CreatedGame", gameSession);
        this.server
          .to(gameSession.player2.playerSocket)
          .emit("CreatedGame", gameSession);
        await this.gameService.removeGameInvite(game.gameInviteId);
      }
      return gameSession;
    } else {
      return null;
    }
  }

  @SubscribeMessage("removeGameInvite")
  async removeGameInvite(@MessageBody() gameInviteId: number) {
    await this.gameService.removeGameInvite(gameInviteId);
    const gameDeleted = await this.prisma.gameInvite.findFirst({
      where: { gameInviteId: gameInviteId },
    });
  }

  @SubscribeMessage("getAllGameInvites")
  async getAllGameInvites() {
    return this.gameService.getAllGameInvite();
  }

  @SubscribeMessage("findGame")
  async gamestart(@MessageBody("gameSocket") gameSocket: string) {
    const game = await this.gameService.findGame(gameSocket);
    if (game) {
      this.server.to(game.player1.playerSocket).emit("findGame", game);
      this.server.to(game.player2.playerSocket).emit("findGame", game);
    }
  }

  @SubscribeMessage("readyToStart")
  async bothPlayerReadyToStart(
    @Request() req: any,
    @MessageBody("gameSocket") gameSocket: string
  ) {
    const game = await this.gameService.findGame(gameSocket);

    if (
      game &&
      (game?.player1.playerProfile?.id === req.user.id ||
        game?.player2.playerProfile?.id === req.user.id)
    ) {
      this.server
        .to(game.player1.playerSocket)
        .emit("bothReadyToStart", req.user.id);
      this.server
        .to(game.player2.playerSocket)
        .emit("bothReadyToStart", req.user.id);
    }
  }

  @SubscribeMessage("setGoalsToWin")
  async setGoalsToWin(
    @MessageBody("gameSocket") gameSocket: string,
    @MessageBody("goalsToWin") goalsToWin: number
  ) {
    const game = await this.gameService.findGame(gameSocket);
    if (game) {
      game.goalsToWin = goalsToWin;
      if (goalsToWin > 20) game.goalsToWin = 20;
      this.server.to(game.player1.playerSocket).emit("goalsToWin", game);
      this.server.to(game.player2.playerSocket).emit("goalsToWin", game);
    }
  }

  @SubscribeMessage("verifyGame")
  async verifyGame(
    @MessageBody("gameSocket") gameSocket: string,
    @MessageBody("userId") userId: number,
    @ConnectedSocket() client: Socket
  ) {
    const boolean = await this.gameService.verifyGame(
      gameSocket,
      client,
      userId
    );
    const game = await this.gameService.findGame(gameSocket);
    if (game) {
      this.server.to(game.player1.playerSocket).emit("verifyGame", boolean);
      this.server.to(game.player2.playerSocket).emit("verifyGame", boolean);
    }
  }

  @SubscribeMessage("notInGame")
  async notInGame(@Request() req: any) {
    const data = await this.gameService.notInGame(req);
    if (data.game) {
      this.server
        .to(data.game.player1.playerSocket)
        .emit("reconnect2", data.boolean);
      this.server
        .to(data.game.player2.playerSocket)
        .emit("reconnect2", data.boolean);
      this.server
        .to(data.game.player1.playerSocket)
        .emit("verifyGame", data.boolean);
      this.server
        .to(data.game.player2.playerSocket)
        .emit("verifyGame", data.boolean);
      data.game.destroyGame(this.prisma);
    }
  }

  @SubscribeMessage("destroyGame")
  async handleGameOut(@ConnectedSocket() client: Socket) {
    let winner = 0;
    const games = await this.gameService.getGame();
    let game = games.find((game) => game.player1.playerSocket === client.id);
    if (game) winner = 2;
    if (!game) {
      game = games.find((game) => game.player2.playerSocket === client.id);
      if (game) winner = 1;
    }
    if (game && game.status === 3)
      this.handleGameFinish(game, winner);
    if (game)
      this.gameService.destroyInGame(game);
  }

  async handleGameFinish(game: Game, winner: number) {
    game.victory = winner;
    game.saveGame(this.prisma);
    let p1Hist = null;
    let p2Hist = null;
    let p1Exp = 0;
    let p2Exp = 0;

    if (winner === 1) {
      this.server.to(game.player1.playerSocket).emit("finish", true);
      this.server.to(game.player2.playerSocket).emit("finish", false);
      p2Hist =
        game.pScore[0] +
        "-" +
        game.pScore[1] +
        " " +
        game.player1.playerProfile?.username +
        " " +
        "Defeat" +
        " " +
        "+5exp";
      p1Hist =
        game.pScore[0] +
        "-" +
        game.pScore[1] +
        " " +
        game.player2.playerProfile?.username +
        " " +
        "Victory" +
        " " +
        "+10exp";
      p1Exp = 10;
      p2Exp = 5;
    } else if (winner === 2) {
      this.server.to(game.player1.playerSocket).emit("finish", false);
      this.server.to(game.player2.playerSocket).emit("finish", true);
      p1Hist =
        game.pScore[0] +
        "-" +
        game.pScore[1] +
        " " +
        game.player2.playerProfile?.username +
        " " +
        "Defeat" +
        " " +
        "+5exp";
      p2Hist =
        game.pScore[0] +
        "-" +
        game.pScore[1] +
        " " +
        game.player1.playerProfile?.username +
        " " +
        "Victory" +
        " " +
        "+10exp";
      p1Exp = 5;
      p2Exp = 10;
    }
    if (
      game.player1.playerProfile &&
      game.player2.playerProfile &&
      p1Hist &&
      p2Hist
    ) {
      await this.gameService.addHistory(
        game.player1.playerProfile,
        p1Hist,
        p1Exp
      );
      await this.gameService.addHistory(
        game.player2.playerProfile,
        p2Hist,
        p2Exp
      );
    }
    this.server.to(game.player1.playerSocket).emit("findGame", game);
    this.server.to(game.player2.playerSocket).emit("findGame", game);
  }

  @SubscribeMessage("launchBall")
  async LaunchBall(@Request() req: any) {
    const game = await this.gameService.LaunchBall(req);
    if (game) {
      let velocity = [0.01, 0];
      delay(50);
      var i = setInterval(async () => {
        game.ball.z += 100 * velocity[0];
        game.ball.x += velocity[1];

        if (game.victory !== 0) {
          this.handleGameFinish.call(this, game, game.victory);
          clearInterval(i);
          this.gameService.destroyInGame(game);
        }

        if (
          game.pScore[0] == game.goalsToWin ||
          game.pScore[1] == game.goalsToWin
        ) {
          if (game.pScore[0] === game.goalsToWin) {
            this.handleGameFinish.call(this, game, 1);
          } else if (game.pScore[1] === game.goalsToWin) {
            this.handleGameFinish.call(this, game, 2);
          }
          clearInterval(i);
          this.gameService.destroyInGame(game);
        }
        const collideRet = await this.gameService.collide(game);

        switch (collideRet) {
          case 0:
            break;
          case 1:
            if (velocity[1] >= 0) velocity[1] = -1;
            velocity[0] *= -1;
            break;
          case 2:
            velocity[0] *= -1;
            break;
          case 3:
            if (velocity[1] <= 0) velocity[1] = 1;
            velocity[0] *= -1;
            break;
          case 4:
            if (velocity[1] <= 0) velocity[1] = 1;
            velocity[0] *= -1;
            break;
          case 5:
            velocity[0] *= -1;
            break;
          case 6:
            if (velocity[1] >= 0) velocity[1] = -1;
            velocity[0] *= -1;
            break;
          case 7:
            velocity[1] *= -1;
            break;
          case 8:
            velocity[1] *= -1;
            break;
          case 9:
            if (game.ball.z <= -100) {
              ++game.pScore[0];
              game.resetBallPosition();
              velocity[1] = 0;
              this.server
                .to(game.player1.playerSocket)
                .emit("gamescore", game.pScore);
              this.server
                .to(game.player2.playerSocket)
                .emit("gamescore", game.pScore);
            }
            break;
          case 10:
            if (game.ball.z >= 100) {
              ++game.pScore[1];
              game.resetBallPosition();
              velocity[1] = 0;
              this.server
                .to(game.player1.playerSocket)
                .emit("gamescore", game.pScore);
              this.server
                .to(game.player2.playerSocket)
                .emit("gamescore", game.pScore);
            }
            break;
        }
        this.server
          .to(game.player1.playerSocket)
          .emit("findposball", game.ball);
        this.server
          .to(game.player2.playerSocket)
          .emit("findposball", game.ball);

        this.server.to(game.player1.playerSocket).emit("findpos", game.paddle);
        this.server.to(game.player2.playerSocket).emit("findpos", game.paddle);
      }, 50);
    }
  }

  @SubscribeMessage("movesInputs")
  async movesInputs(
    @ConnectedSocket() client: Socket,
    @MessageBody("gameSocket") gameSocket: string,
    @MessageBody("move") move: string,
    @MessageBody("upDown") upDown: boolean
  ) {
    const game = await this.gameService.movesInputs(
      gameSocket,
      client.id,
      move,
      upDown,
      this.server
    );
  }

  @SubscribeMessage("updateStatusUser")
  async updateStatusUser(@Request() req: any) {
    await this.prisma.user.update({
      where: { id: req.user.id },
      data: { status: "ONLINE" },
    });
  }

  @SubscribeMessage("gameStatusUpdate")
  async gameStatusUpdate(@MessageBody("gameSocket") gameSocket: string) {
    const game = await this.gameService.findGame(gameSocket);
    if (game) game.status = 3;
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(`Game Client connected: ${client.id}`);
    this.server.to(client.id).emit("reconnect", client.id);
  }

  async handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
    const result = await this.gameService.userInGame(client.id);
    if (result) {
      if (client.id === result.player1.playerSocket) {
        await this.prisma.user.update({
          where: { id: result.player2.playerProfile?.id },
          data: { status: "ONLINE" },
        });
        await this.prisma.user.update({
          where: { id: result.player2.playerProfile?.id },
          data: { status: "OFFLINE" },
        });
      } else if (client.id === result.player2.playerSocket) {
        await this.prisma.user.update({
          where: { id: result.player1.playerProfile?.id },
          data: { status: "ONLINE" },
        });
        await this.prisma.user.update({
          where: { id: result.player2.playerProfile?.id },
          data: { status: "OFFLINE" },
        });
      }
      this.server.to(result.player1.playerSocket).emit("reconnect2", client.id);
      this.server.to(result.player2.playerSocket).emit("reconnect2", client.id);
      this.server.to(client.id).emit("reconnect", client.id);
    }
  }

  // @SubscribeMessage('start_game')
  // handleGameStart(client: any, payload: any): void {
}
