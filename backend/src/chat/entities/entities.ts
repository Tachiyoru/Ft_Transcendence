import { Mode, User } from "@prisma/client";

export class Message {
  message: string;
  author: User;
  chanName: string;
//   channelId: number;
//   createdAt: Date = new Date(Date.now());
}

export class Channel {
  chanId: number;
  name: string;
  owner: User;
  op: string[];
  modes: Mode;
  password: string;
  members: User[];
  messages: Message[];
  bannedUsers: User[];
}
