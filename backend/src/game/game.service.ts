import { WebSocketServer } from '@nestjs/websockets';
import { Injectable, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Socket } from 'socket.io';
import { disconnect, emit } from 'process';
import { User } from '@prisma/client';
import { Game } from './game.class';
import { Server } from 'socket.io';
import
{
	WaitingGameSession,
	Gamer,
} from './interfaces';
import { delay } from 'rxjs';


export interface GameSessionQResponse
{
	matchFound: boolean;
	waitingSession?: WaitingGameSession;
}
@Injectable()
export class GameService
{
	private waitingRoomGame: WaitingGameSession | undefined = undefined;
	private waitingChallenge: Map<number, WaitingGameSession> = new Map();
	private games: Game[] = [];
	constructor(private prisma: PrismaService) {}

	createGamer(
		user: User,
		socketId = '',
		isHost = false,
	): Gamer
	{
		return {
			user,
			socketId,
			isHost,
		};
	}

	async createGame(gameID: number, player1User: number, player1Socket: string, player2User: User, player2Socket: string)
	{
		const host = await this.prisma.user.findUnique(
			{
				where: { id: player1User },
			});
		if (!host)
			return;
		// console.log('ok', gameID, player1User, player1Socket, player2User, player2Socket);
		const game = new Game(gameID, player1Socket, host, player2Socket, player2User);
		this.games.push(game);
		return (game);

	}

	async prepareQueListGame(socket: Socket, @Request() req: any)
	{

		const gamer = this.createGamer(
			req.user,
			socket.id,
			true,
		);
		// check someone is not already waiting in the waiting room
		if (this.waitingRoomGame)
		{
			// check if one game session is already waiting for an opponent
			if (this.waitingRoomGame.hostId === req.user.id)
			{
				return null;
			} else
			{
				gamer.isHost = false;
				const participants = [gamer, this.waitingRoomGame.participants[0]];
				// remove the waiting game session
				this.waitingRoomGame = undefined;
				const gameDB = await this.prisma.game.create({ data: {} });
				const gameSession = await this.createGame(gameDB.gameId, participants[0].user.id, participants[0].socketId, participants[1].user, participants[1].socketId);
				console.log("random gameSession", gameSession);
				return gameSession;
			}
		} else
		{
			const waitingListIds = Array.from(this.waitingChallenge.keys());
			const id =
				waitingListIds.length > 0 ? Math.max(...waitingListIds) + 1 : 1;
			this.waitingRoomGame = {
				waitingGameId: id,
				hostId: gamer.user.id,
				participants: [gamer],
			};
			console.log({ matchFound: false, waitingSession: this.waitingRoomGame });
			return null;
		}
	}

	async createInviteGame(invitedUserId: number, socket: Socket, @Request() req: any)
	{
		const gameInvite = await this.prisma.gameInvite.create(
			{
				data:
				{
					hostId: req.user.id,
					hostSocket: socket.id,
					invitedId: invitedUserId,
				},
			},
		);
		return (gameInvite);
	}

	async checkInvitedGame(hostId: number, socket: Socket, @Request() req: any)
	{
		const gameInvite = await this.prisma.gameInvite.findFirst(
			{
				where:
				{
					hostId: hostId,
					invitedId: req.user.id,
				},
			},
		);
		if (gameInvite)
		{
			const updatedGameInvite = await this.prisma.gameInvite.update(
				{
					where: { gameInviteId: gameInvite.gameInviteId },
					data: {
						invitedSocket: socket.id,
						status: 1
					},
				},
			);
			return (updatedGameInvite);
		}
		return (gameInvite);
	}

	async removeGameInvite(gameInviteId: number)
	{
		const gameInvite = await this.prisma.gameInvite.findFirst(
			{
				where: { gameInviteId: gameInviteId },
			},
		);
		if (gameInvite && gameInvite.status === 1)
		{
			return (await this.prisma.gameInvite.delete(
				{
					where: { gameInviteId: gameInviteId },
				},
			));
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

	async findGame(gameSocket: string)
	{
		const game = this.games.find((game) => game.gameSocket === gameSocket);
		return (game);
	}

	async verifyGame(gameSocket: string, socket: Socket, userId: number)
	{
		console.log(userId);
		const game = this.games.find((game) => game.gameSocket === gameSocket);
		if (
			(game?.player1.playerSocket === socket.id && game?.player1.playerProfile?.id === userId) ||
			(game?.player2.playerSocket === socket.id && game?.player2.playerProfile?.id === userId)
		)
			return (true);
		else if
			(
			(game?.player1.playerSocket !== socket.id && game?.player1.playerProfile?.id === userId) ||
			(game?.player2.playerSocket !== socket.id && game?.player2.playerProfile?.id === userId)
		)
		{
			game?.destroyGame(this.prisma);
			return (false);
		}
		else
			return (false);

	}

	async notInGame(@Request() req: any)
	{
		const game = this.games.find((game) => (game.player1.playerProfile?.id || game.player2.playerProfile?.id) === req.user.id);
		if (game)
			return ({ game: game, boolean: false });
		else
			return ({ game: null, boolean: true });

	}

	async LaunchBall(@Request() req: any)
	{
		const game = this.games.find((game) => (game.player1.playerProfile?.id || game.player2.playerProfile?.id) === req.user.id);

		return (game);
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

	async movesInputs(gameSocket: string, playerSocket: string, input: string, upDown: boolean, server: Server)
	{
		const game = this.games.find((game) => game.gameSocket === gameSocket);
		if (game)
		{
			if (game.player1.playerSocket === playerSocket)
			{
				switch (input)
				{
					case "ArrowLeft":
						if (upDown)
							game.move(input, playerSocket, server);
						return (game);
					case "ArrowRight":
						if (upDown)
							game.move(input, playerSocket, server);
						return (game);
				}
			}
			else if (game.player2.playerSocket === playerSocket)
			{
				switch (input)
				{
					case "ArrowLeft":
						if (upDown)
							game.move(input, playerSocket, server);
						return (game);
					case "ArrowRight":
						if (upDown)
							game.move(input, playerSocket, server);
						return (game);
				}
			}
			return (game);
		}
	}
}