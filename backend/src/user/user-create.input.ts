import { Role } from "@prisma/client";

export interface UserCreateInput {
  username: string;
  avatar?: string;
  tittle?: string;
  email: string;
  hash: string;
  role: Role;
  stats: statsCreateInput;
}
export interface statsCreateInput {
  lvl?: number;
  exp?: number;
  partyPlayed?: number;
  partyWon?: number;
  partyLost?: number;
  history?: string[];
}
