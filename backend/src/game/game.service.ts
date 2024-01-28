import { Injectable, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Socket } from 'socket.io';
import { disconnect, emit } from 'process';
import {
  WaitingGameSession,
  Gamer
} from './interfaces';

export interface GameSessionQResponse {
  matchFound: boolean;
  waitingSession?: WaitingGameSession;
}
@Injectable()
export class GameService {
  private waitingRoomGame: WaitingGameSession | undefined = undefined;
  private waitingChallenge: Map<number, WaitingGameSession> = new Map();
    constructor(private prisma: PrismaService)  {}

    createGamer(
      userId: number,
      username = '',
      avatar = '',
      socketId = '',
      isHost = false,
    ): Gamer {
      return {
        userId,
        username,
        socketId,
        avatar,
        isHost,
      };
    }

    async createGameDB()  {
      return await this.prisma.game.create({ data: {
      }})
    }

    async prepareQueListGame(socket: Socket, @Request() req: any) {

      const gamer = this.createGamer(
        req.user.id,
        req.user.username,
        req.user.profile.avatar ?? '',
        socket.id,
        true,
      );
      // check someone is not already waiting in the waiting room
      if (this.waitingRoomGame) {
        // check if one game session is already waiting for an opponent
        if (this.waitingRoomGame.hostId === req.user.id) {
          return { matchFound: false, waitingSession: this.waitingRoomGame };
        } else {
          gamer.isHost = false;
          const participants = [gamer, this.waitingRoomGame.participants[0]];
          // remove the waiting game session
          this.waitingRoomGame = undefined;
          const gameSession = await this.createGameDB(
          );
          return { matchFound: true, gameSession };
        }
      } else {
        // create a new game session with the host
        const waitingListIds = Array.from(this.waitingChallenge.keys());
        const id =
          waitingListIds.length > 0 ? Math.max(...waitingListIds) + 1 : 1;
        this.waitingRoomGame = {
          waitingGameId: id,
          hostId: gamer.userId,
          participants: [gamer],
        };
        return { matchFound: false, waitingSession: this.waitingRoomGame };
      }
    }

    // async connection(socket: Socket, @Request() req: any)  {
    //   const game = await this.prisma.game.findFirst({
    //     where: {connectedPlayers: 1}
    //   })
    //   const alreadyIG = await this.checkGameUsers(socket);
    //   if (!alreadyIG)  {
    //     if (game) {
    //       const updateGame = await this.prisma.game.update({
    //         where: {gameId: game.gameId},
    //         data: {
    //           connectedPlayers: 2,
    //           player2: socket.id,
    //           player2User: { connect: { id: req.user.id } },
    //         },
    //         include:  {player1User: true, player2User: true}
    //       })
    //       socket.join(updateGame.gameSocket);
    //       console.log(updateGame)
    //       return (updateGame);
    //     } else  {
    //       socket.join("Game" + socket.id);
    //       const rooms = socket.rooms;
    //       const game = await this.prisma.game.create({
    //         data: {
    //           player1: socket.id,
    //           player1User: { connect: { id: req.user.id } },
    //           player2User: { connect: { id: req.user.id } },
    //           connectedPlayers: 1,
    //           gameSocket: ("Game" + socket.id)
    //         }
    //       })
    //       const allGames = await this.prisma.game.findMany({
    //       });
    //       return (null);
    //     }
    //   }
    //   return (null);
    // }

    // async removeUserFromGame(userID: string)  {
    //   let game = await this.prisma.game.findFirst({
    //       where:  {
    //         player1: userID
    //       }
    //   })
    //   if (game) {
    //     this.removeGame(game.gameId);
    //     return ('deleted');
    //   }
    //   game = await this.prisma.game.findFirst({
    //     where:  {
    //       player2: userID
    //     }
    //   })
    //   if (game) {
    //     game.player2 = "";
    //     game.connectedPlayers = 1;
    //     return (game);
    //   }
    //   return (null);
    // }

    async removeGame(gameId: number)  {
      return (await this.prisma.game.delete({
        where:  {
          gameId: gameId
        }
      })
      );
    }

    // async getRoomID(gameSocket: string) {
    //   const game = await this.findGame(gameSocket);
    //   return (game?.gameId);
    // }

    // async findGame(gameSocket: string)  {
    //   const game = await this.prisma.game.findFirst({
    //     where:  {
    //       gameSocket: gameSocket
    //     },
    //     include : {player1User: true, player2User: true}
    //   })
    //   return (game);
    // }

    // async checkGameUsers(socket: Socket)  {
    //   let game = await this.prisma.game.findFirst({
    //     where: {
    //       player1: socket.id
    //     },
    //     include: { player1User: true, player2User: true}
    //   })
    //   if (game)
    //     return (game);
    //   game = await this.prisma.game.findFirst({
    //     where: {
    //       player2: socket.id
    //     },
    //     include: { player1User: true, player2User: true}
    //   })
    //   return (game);
    // }

    // async gamesFull()  {
    //   const lstGamesOff = await this.prisma.game.findMany({
    //     where:  {
    //       inGame: 0,
    //       connectedPlayers: 2
    //     }
    //   })

    //   return (lstGamesOff);
    // }

    // async startGame(gameSocket: string) {
    //   const fieldWidth = 1200;
    //   const fieldLenght = 3000;
    //   const paddle1Default = {}
    // }
}