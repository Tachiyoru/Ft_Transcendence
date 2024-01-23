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
      console.log("DEIWNIFHEWBNFHBEWJHBFJKEWF", game);
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
        console.log("la")
      
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
