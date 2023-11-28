import { StatusUser, User } from "@prisma/client";

export class Message {
  message: string;
  author: string;
//   channelId: number;
//   createdAt: Date = new Date(Date.now());
}

export type Member = {
  memberId: number;
  nickName: string;
  avatar: string;
  status: StatusUser;
  modes: string;
};

export class Channel {
  chanId: number;
  name: string;
  owner: string;
  op: string[];
  modes: number;
  password: string;
  userLimit: number;
  members: Member[];
  messages: Message[];
  bannedUsers: User[];
}
