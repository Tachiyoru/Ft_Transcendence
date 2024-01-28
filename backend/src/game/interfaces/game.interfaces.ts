import { Socket } from "dgram";

export interface Gamer {
	userId: number;
	username: string;
	socketId: string;
	avatar?: string;
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