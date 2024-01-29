import { WebSocketServer } from '@nestjs/websockets';
import { Injectable, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Socket } from 'socket.io';
import { disconnect, emit } from 'process';
import { User } from '@prisma/client';
import { Game } from './game.class';
import { Server } from 'socket.io';
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
  private games: Game[] = [];
    constructor(private prisma: PrismaService)  {}

    createGamer(
      user: User,
      socketId = '',
      isHost = false,
    ): Gamer {
      return {
        user,
        socketId,
        isHost,
      };
    }

    
    async createGame(gameID: number, player1User: User, player1Socket: string, player2User: User, player2Socket: string)  {
      //console.log('ok', gameID, player1User, player1Socket, player2User, player2Socket)
      const game = new Game(gameID, player1Socket, player1User, player2Socket, player2User);
      this.games.push(game);
      return(game);
      
    }

    async prepareQueListGame(socket: Socket, @Request() req: any) {

      const gamer = this.createGamer(
        req.user,
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
          const gameDB = await this.prisma.game.create({data: {}});
          const gameSession = this.createGame(gameDB.gameId, participants[0].user, participants[0].socketId, participants[1].user, participants[1].socketId);
          return gameSession;
        }

      } else {
        // create a new game session with the host
        const waitingListIds = Array.from(this.waitingChallenge.keys());
        const id =
          waitingListIds.length > 0 ? Math.max(...waitingListIds) + 1 : 1;
        this.waitingRoomGame = {
          waitingGameId: id,
          hostId: gamer.user.id,
          participants: [gamer],
        };
        console.log ({ matchFound: false, waitingSession: this.waitingRoomGame});
        return null;
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

//     async removeUserFromGame(userID: string)  {
//       let game = await this.prisma.game.findFirst({
//           where:  {
//             player1: userID
//           }
//       })
//       if (game) {
//         this.removeGame(game.gameId);
//         return ('deleted');
//       }
//       game = await this.prisma.game.findFirst({
//         where:  {
//           player2: userID
//         }
//       })
//       if (game) {
//         game.player2 = "";
//         game.connectedPlayers = 1;
//         return (game);
//       }
//       return (null);
//     }

//     async removeGame(gameId: number)  {
//       return (await this.prisma.game.delete({
//         where:  {
//           gameId: gameId
//         }
//       })
//       );
//     }

//     async getRoomID(gameSocket: string) {
//       const game = await this.findGame(gameSocket);
//       return (game?.gameId);
//     }

    async findGame(gameId: number)  {
      return this.games.find((game) => game.gameId === gameId);
    }

//     async checkGameUsers(socket: Socket)  {
//       let game = await this.prisma.game.findFirst({
//         where: {
//           player1: socket.id
//         },
//         include: { player1User: true, player2User: true}
//       })
//       if (game)
//         return (game);
//       game = await this.prisma.game.findFirst({
//         where: {
//           player2: socket.id
//         },
//         include: { player1User: true, player2User: true}
//       })
//       return (game);
//     }

//     async gamesFull()  {
//       const lstGamesOff = await this.prisma.game.findMany({
//         where:  {
//           inGame: 0,
//           connectedPlayers: 2
//         }
//       })

//       return (lstGamesOff);
//     }

//     async startGame(gameSocket: string) {
//       const fieldWidth = 1200;
//       const fieldLenght = 3000;
//       const paddle1Default = {x: 0, y: 0, z: 0};
//       const paddle2Default = {x: 0, y: 0, z: 0};
//       const score = {player1: 0, player2: 0};

//     }

//     async resetValues(gameSocket: string) {
//       const game = await this.findGame(gameSocket);
//       if (game) {
//         // Paddle p1
//         game.paddle[0].x = 0;
//         game.paddle[0].y = 0;
//         game.paddle[0].z = 0;

//         // Paddle p2
//         game.paddle[1].x = 0;
//         game.paddle[1].y = 0;
//         game.paddle[1].z = 0;
        
//         if (game.ball)  {
//           game.ball.x = 0;
//           game.ball.y = 0;
//           game.ball.z = 0;
//         }

//         game.pScore[0] = 0;
//         game.pScore[1] = 0;
//       }
//     }

//     async scored(gameSocket: string, playerID: string)  {
//       const game = await this.findGame(gameSocket);

//       if (game) {
//         if (game.player1 === playerID)
//           game.pScore[0]++;
//         else if (game.player2 === playerID)
//           game.pScore[1]++;
//       }
//     }

//     async movesInputs(gameSocket: string, playerID: string, input: string)  {
//       const game = await this.findGame(gameSocket);
      
//       if (game) {
//         if (game.player1 === playerID)  {
//           switch (input)  {
//             case "ArrowLeft":
              
//           }
//         }
//         else if (game.player2 === playerID) {

//         }
//       }
//     }
}