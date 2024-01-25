import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService)  {}

    async connection(socket: Socket)  {
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
              player2: socket.id
            }
          })
          socket.join(updateGame.gameSocket);
          console.log("game post modif = ", updateGame);
          return updateGame;
        } else  {
          socket.join("Game" + socket.id);
          const rooms = socket.rooms;
          console.log(rooms);
          const game = await this.prisma.game.create({
            data: {
              player1: socket.id,
              connectedPlayers: 1,
              gameSocket: ("Game" + socket.id)
            }
          })
          console.log(game);
          return (game);
        }
      }
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

    async startGame(gameID: String) {
      const fieldWidth = 1200;
      const fieldLenght = 3000;
      const paddle1Default = {}
    }
}
