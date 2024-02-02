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

export interface Player    {
    playerSocket: string;
    playerProfile: User | null;
}


export interface Paddle    {
    x: number;
    y: number;
    z: number;
}


export interface Ball  {
    x: number;
    y: number;
    z: number;
}


export interface Camera    {
    x: number;
    y: number;
    z: number;
    fov: number;
    angle: number;
}

export interface ArrowState {
	arrowLeft: boolean;
	arrowRight: boolean;
	gameSocket: string;
}

export interface Velocity	{
	x: number;
	z: number;
}