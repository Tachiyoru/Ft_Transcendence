import { User } from "@prisma/client";
import { Socket } from "dgram";

export interface Gamer {
	user: User;
	socketId: string;
	isHost?: boolean;
}

export enum GameSessionType {
	Bot,
	QueListGame,
	CompetitionGame,
	PrivateGame,
}

export interface WaitingGameSession {
	waitingGameId: number;
	hostId: number;
	participants: Gamer[];
	played?: boolean;
}