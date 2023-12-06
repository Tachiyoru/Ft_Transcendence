import { Role } from "@prisma/client";

export interface UserCreateInput {
  username: string;
  avatar?: string;
  tittle?: string;
  email: string;
  hash: string;
  role: Role;
}
