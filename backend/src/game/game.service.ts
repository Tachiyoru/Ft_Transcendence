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
              player2User: { connect: { id: req.user.id } }
            },
            include:  {player1User: true, player2User: true}
          })
          socket.join(updateGame.gameSocket);
          console.log(updateGame)
          return (updateGame);
        } else  {
          socket.join("Game" + socket.id);
          const rooms = socket.rooms;
          const game = await this.prisma.game.create({
            data: {
              player1: socket.id,
              player1User: { connect: { id: req.user.id } },
              player2User: { connect: { id: req.user.id } },
              connectedPlayers: 1,
              gameSocket: ("Game" + socket.id)
            }
          })
          return (null);
        }
      }
      return (null);
    }

    async removeUserFromGame(userID: string)  {
      let game = await this.prisma.game.findFirst({
          where:  {
            player1: userID
          }
      })
      if (game) {
        this.removeGame(game.gameId);
        return ('deleted');
      }
      game = await this.prisma.game.findFirst({
        where:  {
          player2: userID
        }
      })
      if (game) {
        game.player2 = "";
        game.connectedPlayers = 1;
        return (game);
      }
      return (null);
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