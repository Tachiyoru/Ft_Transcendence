import { Injectable, Request, RequestMapping } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Channel, Mode, User } from "@prisma/client";

@Injectable()
export class chatService {
  constructor(private readonly prisma: PrismaService) {}

  //   dans le front on envoie le nom du chan et le nom des users qui sont dedans
  //   const createChannel = (channelName) => {
  // 	// Appeler le serveur pour créer un nouveau canal
  // 	socket.emit('createChannel', { channelName });
  //   };

  async createChannel(
    channelName: string,
    users: User[],
    mode: Mode,
    @Request() req: any
  ) {
    // voir dans le front comment envoyer sois la liste des target pour la conversation soit juste un nom pour le chan directement
    const existingChannel = await this.prisma.channel.findUnique({
      where: { name: channelName },
    });
    while (existingChannel) {
      channelName = channelName + "1";
    }
    const channel: Channel = await this.prisma.channel.create({
      data: {
        name: channelName,
        modes: mode,
        owner: { connect: { id: req.user.id } },
        members: { connect: users.map((user) => ({ id: user.id })) },
      },
    });
    return channel;
  }

  async addOp(chanName: string, username: string, owner: User, req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (req.user.id === owner) {
      throw new Error("You are not allowed to add an op to this channel");
    }
    if (chan.op.includes(username)) {
      throw new Error("User is already an op in this channel");
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { name: chanName },
      data: { op: { push: username } },
    });

    return updatedChannel;
  }

  async renameChan(chanName: string, newName: string, owner: User, req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (req.user === owner || chan.op.includes(req.user.username)) {
      const updatedChannel = await this.prisma.channel.update({
        where: { name: chanName },
        data: { name: newName },
      });
      return updatedChannel;
    } else {
      throw new Error("You are not allowed to rename this channel");
    }
  }

  async joinChannel(chanName: string, banlist: User[], @Request() req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (banlist.includes(req.user)) {
      throw new Error("You are banned from this channel");
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { name: chanName },
      data: { members: { connect: { id: req.user.id } } },
    });
    return updatedChannel;
  }

  async leaveChannel(chanName: string, owner: User, @Request() req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (req.user === owner) {
      await this.prisma.channel.delete({
        where: { name: chanName },
      });
      return {
        success: true,
        message: `Channel ${chanName} deleted successfully`,
      };
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { name: chanName },
      data: { members: { disconnect: { id: req.user.id } } },
    });
    return updatedChannel;
  }

  async banUser(
    chanName: string,
    username: string,
    banlist: User[],
    owner: User,
    req: any
  ) {
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (req.user !== owner && !chan.op.includes(req.user.username)) {
      throw new Error("You are not allowed to ban a user from this channel");
    }
    const target = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!target) {
      throw new Error("Could not find user");
    }
    if (banlist.includes(target)) {
      throw new Error("User is already banned from this channel");
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { name: chanName },
      data: {
        banned: { connect: { id :target.id } },
        members: { disconnect: { id :target.id } },
      },
    });
    return updatedChannel;
  }

  async unBanUser(
    chanName: string,
    username: string,
    banlist: User[],
    owner: User,
    req: any
  ) {
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (req.user !== owner && !chan.op.includes(req.user.username)) {
      throw new Error("You are not allowed to unban a user from this channel");
    }
    const target = await this.prisma.user.findUnique({
      where: { username: username },
    });
	if (!target) {
		throw new Error("Could not find user");
	  }
	  if (!banlist.includes(target)) {
		throw new Error("User is not banned from this channel");
	  }
	  const updatedChannel = await this.prisma.channel.update({
		where: { name: chanName },
		data: {
		  banned: { disconnect: { id :target.id } },
		},
	  });
	  return updatedChannel;
	}

  //   async messageSend(@Request() req: any, createMessageDto: CreateMessageDto) {
  //     const user: User = req.user;
  //     const message = {
  //       author: user.id,
  //       message: createMessageDto.message,
  //       //   createdAt: new Date(Date.now()),
  //     };
  //     return message;
  //   }

  //   findAll() {
  //     return this.messages;
  //   }
}
// update(id: number, updateMessageDto: UpdateMessageDto) {
// 	return `This action updates a #${id} message`;
// }

// remove(id: number) {
// 	return `This action removes a #${id} message`;
// }
