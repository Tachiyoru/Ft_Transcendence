import { User } from "@prisma/client";
import { PrismaService } from '../prisma/prisma.service';
import { Paddle, Camera, Ball, Player, Velocity, PaddleHit, BallHit } from "./interfaces";
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { delay } from "rxjs";

export class Game  {
    gameId: number;
    gameSocket: string;
    paddle: Paddle[] = [{ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }];
    paddleHitbox: PaddleHit[] = [{sizex: 0, sizey: 0, sizez: 0}, {sizex : 0, sizey : 0, sizez : 0}];
    camera: Camera[] = [{ x: 0, y: 0, z: 0, fov: 0, angle: 0 }, { x: 0, y: 0, z: 0, fov: 0, angle: 0 }];
    ball: Ball = { x: 0, y: 0, z: 0 };
    ballHitbox: BallHit = {sizex: 0, sizey: 0, sizez: 0};
    pScore: number[] = [0, 0];
    player1: Player = { playerSocket: "", playerProfile: null }; 
    player2: Player = { playerSocket: "", playerProfile: null }; 
    connectedPlayers: number;
    victory: number;
    status: number;
    multiplier: number = 1;
    releasedp1: number = 0;
    releasedp2: number = 0;
    velocity: Velocity = {x: 0, z: 0};
    stopped: boolean = false;


    constructor(gameId: number, player1: string, player1Profile: User, player2: string, player2Profile: User)   {
        this.gameId = gameId;
        this.gameSocket = "Game" + player1;

        // Player 1 Paddle
        this.paddle[0].x = 0;
        this.paddle[0].y = 3.5;
        this.paddle[0].z = 87.5;

        // Player 1 Paddle Hitbox
        this.paddleHitbox[0].sizex = 35;
        this.paddleHitbox[0].sizey = 7;
        this.paddleHitbox[0].sizez = 5; 

        // Player 1 Camera
        this.camera[0].x = 0;
        this.camera[0].y = 65;
        this.camera[0].z = 187.5;
        this.camera[0].angle = 0;

        // Player 2 Paddle
        this.paddle[1].x = 0;
        this.paddle[1].y = 3.5;
        this.paddle[1].z = -87.5;

        // Player 2 Paddle Hitbox
        this.paddleHitbox[1].sizex = 35;
        this.paddleHitbox[1].sizey = 7;
        this.paddleHitbox[1].sizez = 5;

        // Player 2 Camera
        this.camera[1].x = 0;
        this.camera[1].y = 65;
        this.camera[1].z = -187.5;
        this.camera[1].angle = 0;

        this.ball.x = 0;
        this.ball.y = 5;
        this.ball.z = 0;

        this.ballHitbox.sizex = 10;
        this.ballHitbox.sizey = 10;
        this.ballHitbox.sizez = 10;

        this.pScore[0] = 0;
        this.pScore[1] = 0;

        this.player1.playerProfile = player1Profile;
        this.player1.playerSocket = player1;

        this.player2.playerProfile = player2Profile;
        this.player2.playerSocket = player2;

        this.connectedPlayers = 2;
        this.victory = 0;
        this.multiplier = 1;
        this.status = 2;
    };

    saveGame(prisma: PrismaService)  {
        prisma.game.update({
            where:  {
                gameId: this.gameId
            },
            data: {
                gameSocket: this.gameSocket,
                player1: this.player1.playerProfile?.id,
                player2: this.player2.playerProfile?.id,
                scorePlayer1: this.pScore[0],
                scorePlayer2: this.pScore[1],
                victory: this.victory,
                status: this.status
            }
        })
    }

    destroyGame(prisma: PrismaService)  {
        if (this.status === 3)  {
            this.saveGame(prisma);
        }
    }

    resetBallPosition() {
        this.ball.x = 0;
        this.ball.y = 5;
        this.ball.z = 0;
    }

    startBallMovement()	{
		var direction = Math.random() > 0.5 ? -1 : 1;
		this.velocity = {
			x : 0,
			z : direction * 20
		};
		this.stopped = false;
	}
    
    scored(playerScored: string, prisma: PrismaService)    {
        if (playerScored === this.player1.playerSocket)
            this.pScore[0]++;
        else
            this.pScore[1]++;
        if (this.pScore[0] === 8)
            this.winner(1, prisma);
        else if (this.pScore[1] === 8)
            this.winner(2, prisma);
    }

    winner(playerWon: number, prisma: PrismaService)  {
        if (playerWon === 1)    {
            this.victory = 1;
            this.destroyGame(prisma);
        } else  {
            this.victory = 2;
            this.destroyGame(prisma);
        }
    }

    move(input: string, player: string, server: Server) {
        const halfPaddle = this.paddleHitbox[0].sizex / 2;
        const wallLeftP1 = -60 + halfPaddle;
        const wallRightP1 = 60 - halfPaddle;
        const wallLeftP2 = wallRightP1;
        const wallRightP2 = wallLeftP1;

        if (player === this.player1.playerSocket)   {
            switch (input)  {
                case "ArrowLeft":
                    if (this.multiplier < 3)
                        this.multiplier += 0.3;
                    if (this.paddle[0].x + this.multiplier > wallLeftP1)
                        this.camera[0].x = this.paddle[0].x -= 1 * this.multiplier;
                break;
                case "ArrowRight":
                    if (this.multiplier < 3)
                        this.multiplier += 0.3;
                    if (this.paddle[0].x + this.multiplier < wallRightP1)
                        this.camera[0].x = this.paddle[0].x += 1 * this.multiplier;
                break;
            }
            console.log("PADDLE 1 X : ", this.paddle[0].x);
        }
        if (player === this.player2.playerSocket)   {
            switch (input)  {
                case "ArrowLeft":
                    if (this.multiplier < 3)
                        this.multiplier += 0.3;
                    if (this.paddle[1].x + this.multiplier < wallLeftP2)
                        this.camera[1].x = this.paddle[1].x += 1 * this.multiplier;
                break;
                case "ArrowRight":
                    if (this.multiplier < 3)
                        this.multiplier += 0.3;
                    if (this.paddle[1].x + this.multiplier > wallRightP2)
                        this.camera[1].x = this.paddle[1].x -= 1 * this.multiplier;
                break;
            }
        }
    }

    stop(input: string, player: string, server: Server) {
        if (player === this.player1.playerSocket)   {
            switch (input)  {
                case "ArrowLeft":
                    this.multiplier = 1;
                break;
                case "ArrowRight":
                    this.multiplier = 1;
                break;
            }
        }
        if (player === this.player2.playerSocket)   {
            switch (input)  {
                case "ArrowLeft":
                    this.multiplier = 1;
                break;
                case "ArrowRight":
                    this.multiplier = 1;
                break;
            }
        }
    }

    // moves(input: string, player: string, upDown: number)    {
    //     if (player === this.player1.playerSocket && upDown === 1)   {
    //         switch (input)  {
    //             case "ArrowLeft":
    //                 if (((this.paddle[0].x) - (1 * this.multiplier)) >= -35)   {
    //                     this.camera[0].x = this.paddle[0].x -= 1 * this.multiplier;
    //                     this.multiplier++;
    //                 } else if (((this.paddle[0].x) - 1) > -35)  {
    //                     this.multiplier = 1;
    //             }
    //             break;
    //             case "ArrowRight":
    //                 if (((this.paddle[0].x) + (1 * this.multiplier)) <= 35)    {
    //                     this.camera[0].x = this.paddle[0].x += 1 * this.multiplier;
    //                     this.multiplier++;
    //                 } else if (((this.paddle[0].x) + 1) < 35)  {
    //                     this.multiplier = 1;
    //                 }
    //                 console.log(this.paddle[1].x)
    //             break;
    //         }
    //     }
    //     else if (player === this.player1.playerSocket && upDown === 2)   {
    //         switch (input)  {
    //             case "ArrowLeft":
    //                 this.multiplier = 1;
    //             break;
    //             case "ArrowRight":
    //                 this.multiplier = 1;
    //             break;
    //         }
    //     }
    //     else if (player === this.player2.playerSocket && upDown === 1)  {
    //         switch (input)  {
    //             case "ArrowLeft":
    //                 if (((this.paddle[1].x) + (1 * this.multiplier)) <= 35)    {
    //                     this.camera[1].x = this.paddle[1].x += 1 * this.multiplier;
    //                     this.multiplier++;
    //                 }   else if (((this.paddle[1].x) + 1) < 35)  {
    //                     this.multiplier = 1;
    //                 }
    //             break;
    //             case "ArrowRight":
    //                 if (((this.paddle[1].x) - (1 * this.multiplier)) >= -35)   {
    //                     this.camera[1].x = this.paddle[1].x -= 1 * this.multiplier;
    //                     this.multiplier++;
    //                 }   else if (((this.paddle[1].x) - 1) > -35)  {
    //                     this.multiplier = 1;   
    //                 }
    //             break;
    //         }
    //     }
    //     else if (player === this.player2.playerSocket && upDown === 2)  {
    //         switch (input)  {
    //             case "ArrowLeft":
    //                 this.multiplier = 1;
    //             break;
    //             case "ArrowRight":
    //                 this.multiplier = 1;
    //             break;
    //         }
    //     }
    // }
}