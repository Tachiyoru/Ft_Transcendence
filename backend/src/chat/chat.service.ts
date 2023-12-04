import { Injectable, Request } from "@nestjs/common";
import {
  CreateMessageDto,
  UpdateMessageDto,
  createChannel,
} from "./dto/create-message.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Channel, Message, Mode, User } from "@prisma/client";
import * as argon from "argon2";
import { channel } from "diagnostics_channel";

@Injectable()
export class chatService {
  constructor(private readonly prisma: PrismaService) {}

  //   dans le front on envoie le nom du chan et le nom des users qui sont dedans
  //   const createChannel = (channelName) => {
  // 	// Appeler le serveur pour créer un nouveau canal
  // 	socket.emit('createChannel', { channelName });
  //   };

  // voir dans le front comment envoyer sois la liste des target pour la GROUPCHAT soit juste un nom pour le chan directement
  async createChannel(settings: createChannel, @Request() req: any) {
    const existingChannel = await this.prisma.channel.findUnique({
      where: { name: settings.name },
    });
    if (existingChannel) {
      throw new Error("Channel's name is already taken");
    }
    const hashedPassword: string = settings.password
      ? await argon.hash(settings.password)
      : "";
    const channel: Channel = await this.prisma.channel.create({
      data: {
        name: settings.name,
        modes: settings.mode,
        password: hashedPassword,
        owner: { connect: { id: req.user.id } },
        members: { connect: settings.members.map((user) => ({ id: user.id })) },
      },
    });
    return channel;
  }

  async addOp(
    chanName: string,
    username: string,
    owner: User,
    @Request() req: any
  ) {
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (req.user !== owner) {
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

  async renameChan(
    chanName: string,
    newName: string,
    owner: User,
    @Request() req: any
  ) {
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

  async joinChannel(
    chanName: string,
    invited: boolean,
    @Request() req: any,
    password?: string
  ) {
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    const banlist: User[] = await channel
      .caller(this.prisma.channel.findUnique({ where: { name: chanName } }))
      .banned();
    if (banlist.includes(req.user)) {
      throw new Error("You are banned from this channel");
    }
    if (chan.modes === Mode.CHAT) {
    } else if (chan.modes === Mode.GROUPCHAT) {
    } else if (chan.modes === Mode.PRIVATE) {
      const hashedPassword: string = password ? await argon.hash(password) : "";
      if (hashedPassword !== chan.password) {
        throw new Error("Wrong password");
      }
    } else if (chan.modes === Mode.INVONLY) {
      if (invited === false) {
        throw new Error("You are not allowed to join this channel");
      }
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { name: chanName },
      data: { members: { connect: { id: req.user.id } } },
    });
    return updatedChannel;
  }

  async leaveChannel(
    chanName: string,
    owner: User,
    @Request() @Request() req: any
  ) {
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
    @Request() req: any
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
        banned: { connect: { id: target.id } },
        members: { disconnect: { id: target.id } },
      },
    });
    return updatedChannel;
  }

  async unBanUser(
    chanName: string,
    username: string,
    banlist: User[],
    owner: User,
    @Request() req: any
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
        banned: { disconnect: { id: target.id } },
      },
    });
    return updatedChannel;
  }

  async kickUser(
    chanName: string,
    username: string,
    owner: User,
    @Request() req: any
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
    const updatedChannel = await this.prisma.channel.update({
      where: { name: chanName },
      data: {
        members: { disconnect: { id: target.id } },
      },
    });
    return updatedChannel;
  }

  async createMessage(
    createMessageDto: CreateMessageDto,
    @Request() req: any
  ): Promise<Message> {
    const { content, chanName, author } = createMessageDto;
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
      include: { banned: true },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    const target = await this.prisma.user.findUnique({
      where: { username: req.user.username },
    });
    if (!target) {
      throw new Error("Could not find user");
    } else if (chan.banned.includes(target)) {
      throw new Error("User has been banned from this channel");
    } else {
      const message = await this.prisma.message.create({
        data: {
          content: content,
          channel: { connect: { name: chan.name } },
          author: { connect: { id: target.id } },
        },
      });
      return message;
    }
  }
  // si chan.banned ne fonctionne pas utiliser la fonction interne au service pour vérifier
  // si l'user est ban .some((user) => user.username === req.user.username)

  async updateMessage(UpdateMessageDto: UpdateMessageDto, @Request() req: any) {
    const { content, chanName, msgId } = UpdateMessageDto;
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    const target = await this.prisma.message.findUnique({
      where: {
        channelName: chanName,
        id: msgId,
      },
      include: { author: true },
    });
    if (!target) {
      throw new Error("Could not find message");
    } else if (target.author.username !== req.user.username) {
      throw new Error(
        "You are not allowed to update messages from this channel"
      );
    }
    const updatedChannel = await this.prisma.message.update({
      where: { channelName: chanName, id: msgId },
      data: { content: content },
    });
    return updatedChannel;
  }

  async removeMessages(
    chanName: string,
    msgId: number,
    owner: User,
    @Request() req: any
  ) {
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    const target = await this.prisma.message.findUnique({
      where: {
        channelName: chanName,
        id: msgId,
      },
      include: { author: true },
    });
    if (!target) {
      throw new Error("Could not find message");
    }
    if (
      req.user !== owner &&
      !chan.op.includes(req.user.username) &&
      target.author.username !== req.user.username
    ) {
      throw new Error(
        "You are not allowed to remove messages from this channel"
      );
    }
    const updatedChannel = await this.prisma.message.delete({
      where: { channelName: chanName, id: msgId },
    });
    return updatedChannel;
  }
}
