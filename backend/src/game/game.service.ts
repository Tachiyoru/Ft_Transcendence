import { WebSocketServer } from '@nestjs/websockets';
import { Injectable, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Socket } from 'socket.io';
import { disconnect, emit } from 'process';
import { User } from '@prisma/client';
import { Game } from './game.class';
import { Server } from 'socket.io';

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService)  {}
    @WebSocketServer() server: Server;

      async createGame(gameID: number, player1User: User, player1Socket: string, player2User: User, player2Socket: string)  {
        const game = new Game(gameID, player1Socket, player1User, player2Socket, player2User);
        this.server.emit("CreatedGame", game);
      }
//     async connection(socket: Socket, @Request() req: any)  {
//       console.log(req.user.getUser);
//       // const game = new Game();
//       // if (!game)  {
//       //   if (!game) {
//       //     const user = req.user.i
//       //     game.updatePlayer2(socket.id,)
//       //     const updateGame = await this.prisma.game.update({
//       //       where: {gameId: game.gameId},
//       //       data: {
//       //         connectedPlayers: 2,
//       //         player2: socket.id,
//       //         player2User: { connect: { id: req.user.id } },
//       //       },
//       //       include:  {player1User: true, player2User: true}
//       //     })
//       //     socket.join(updateGame.gameSocket);
//       //     console.log(updateGame)
//       //     return (updateGame);
//       //   } else  {
//       //     socket.join("Game" + socket.id);
//       //     const rooms = socket.rooms;
//       //     const game = await this.prisma.game.create({
//       //       data: {
//       //         player1: socket.id,
//       //         player1User: { connect: { id: req.user.id } },
//       //         player2User: { connect: { id: req.user.id } },
//       //         connectedPlayers: 1,
//       //         gameSocket: ("Game" + socket.id)
//       //       }
//       //     })
//       //     const allGames = await this.prisma.game.findMany({
//       //     });
//       //     return (null);
//       //   }
//       // }
//       // return (null);
//     }

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

//     async findGame(gameSocket: string)  {
//       const game = await this.prisma.game.findFirst({
//         where:  {
//           gameSocket: gameSocket
//         },
//         include : {player1User: true, player2User: true, paddle: true, ball: true}
//       })
//       return (game);
//     }

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