import { Injectable, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Socket } from 'socket.io';
import { disconnect, emit } from 'process';

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService)  {}

    async connection(socket: Socket, @Request() req: any)  {
      const game = await this.prisma.game.findFirst({
        where: {connectedPlayers: 1}
      })
      const alreadyIG = await this.checkGameUsers(socket);
      if (!alreadyIG)  {
        if (game) {
          const updateGame = await this.prisma.game.update({
            where: {gameId: game.gameId},
            data: {
              connectedPlayers: 2,
              player2: socket.id,
              player2User: req.user
            }
          })
          socket.join(updateGame.gameSocket);
          console.log("game post modif = ", updateGame);
          return (updateGame);
        } else  {
          socket.join("Game" + socket.id);
          const rooms = socket.rooms;
          console.log(rooms);
          const game = await this.prisma.game.create({
            data: {
              player1: socket.id,
              player1User: req.user,
              player2User: req.user,
              connectedPlayers: 1,
              gameSocket: ("Game" + socket.id)
            }
          })
          console.log(game);
          return (null);
        }
      }
      return (null);
    }
    
    async disconnect(socket: Socket)  {

    }

    async disconnectOutGame(gameSocket: string) {
      const game = await this.findGame(gameSocket);
      
      if (game?.player1 === "") {
        const gameID = await this.getRoomID(gameSocket);
        if (gameID)
          await this.removeGame(gameID);
      }
    }

    async removeGame(gameId: number)  {
      return (await this.prisma.game.delete({
        where:  {
          gameId: gameId
        }
      })
      );
    }

    async getRoomID(gameSocket: string) {
      const game = await this.findGame(gameSocket);
      return (game?.gameId);
    }

    async findGame(gameSocket: string)  {
      const game = await this.prisma.game.findFirst({
        where:  {
          gameSocket: gameSocket
        },
      })
      return (game);
    }

    async findClient(clientSocket: string)  {

    }

    async checkGameUsers(socket: Socket)  {
      let game = await this.prisma.game.findFirst({
        where: {
          player1: socket.id
        }
      })
      if (game)
        return (game);
      game = await this.prisma.game.findFirst({
        where: {
          player2: socket.id
        }
      })
      return (game);
    }

    async gamesFull()  {
      const lstGamesOff = await this.prisma.game.findMany({
        where:  {
          inGame: 0,
          connectedPlayers: 2
        }
      })

      return (lstGamesOff);
    }

    async startGame(gameSocket: string) {
      const fieldWidth = 1200;
      const fieldLenght = 3000;
      const paddle1Default = {}
    }
}
