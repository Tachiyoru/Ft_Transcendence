import { Injectable, Request } from "@nestjs/common";
import {
  CreateMessageDto,
  UpdateMessageDto,
  createChannel,
} from "./dto/create-message.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Channel, Message, Mode, User } from "@prisma/client";
import * as argon from "argon2";
import { NotificationService } from "src/notification/notification.service";
import { NotificationType } from "src/notification/content-notification";
import { CreateNotificationDto } from "src/notification/dto/create-notification.dto";

@Injectable()
export class chatService {
  constructor(
    private readonly prisma: PrismaService,
    private notificationService: NotificationService
  ) {}

  async createChannel(settings: createChannel, @Request() req: any) {
    if (settings.mode === "CHAT") {
      settings.name =
        settings.members.map((user) => user.username).join(", ") +
        ", " +
        req.user.username;
    }
    const existingChannel = await this.prisma.channel.findUnique({
      where: { name: settings.name },
    });

    if (existingChannel) {
      throw new Error("Channel's name is already taken");
    }

	const hash = await argon.hash(settings.password);
    const channel: Channel = await this.prisma.channel.create({
      data: {
        name: settings.name,
        modes: settings.mode,
        password: hash,
        owner: { connect: { id: req.user.id } },
        members: {
          connect: [
            { id: req.user.id },
            ...settings.members.map((user) => ({ id: user.id })),
          ],
        },
      },
    });
    return channel;
  }

  async editChannel(
    channelId: number,
    updatedSettings: Partial<createChannel>,
    @Request() req: any
  ) {
    const existingChannel = await this.prisma.channel.findUnique({
      where: { chanId: channelId },
      include: { owner: true, members: true },
    });
    if (!existingChannel) {
      throw new Error("Channel not found");
    }
    if (existingChannel.owner.id !== req.user.id) {
      throw new Error("You don't have permission to edit this channel");
    }

    const updatedData: Record<string, any> = {};

    if (updatedSettings.name) {
      updatedData.name = updatedSettings.name;
    }
    if (updatedSettings.mode) {
      updatedData.modes = updatedSettings.mode;
    }
    if (updatedSettings.password) {
      updatedData.password = await argon.hash(updatedSettings.password);
    }

    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: channelId },
      data: updatedData,
    });

    return updatedChannel;
  }

  async getOrCreateChatChannel(
    @Request() req: any,
    username2: string,
    id: number
  ): Promise<number> {
    const existingChannel = await this.prisma.channel.findFirst({
      where: {
        AND: [
          {
            members: { some: { id: req.user.id } },
          },
          {
            members: { some: { id: id } },
          },
          {
            modes: "CHAT",
          },
        ],
      },
      select: {
        chanId: true,
      },
    });

    if (existingChannel) {
      return existingChannel.chanId;
    }

    const newChannel = await this.prisma.channel.create({
      data: {
        name: `${req.user.username}, ${username2}`,
        modes: "CHAT",
        owner: { connect: { id: req.user.id } },
        members: {
          connect: [{ id: req.user.id }, { id: id }],
        },
      },
    });

    return newChannel.chanId;
  }

  async getChannelsByUserId(userId: number): Promise<Channel[]> {
    const channels = await this.prisma.channel.findMany({
      where: { members: { some: { id: userId } } },
      include: {
        messages: true,
        owner: true,
        members: true,
        invitedList: true,
        banned: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    if (!channels) return [];
    return channels;
  }

  async getGroupChatChannelsUserIsNotIn(userId: number): Promise<Channel[]> {
    const channels = await this.prisma.channel.findMany({
      where: {
        AND: [
          {
            OR: [{ modes: "GROUPCHAT" }, { modes: "PROTECTED" }],
          },
          {
            NOT: {
              members: { some: { id: userId } },
            },
          },
        ],
      },
    });
    return channels;
  }

  async getUsersNotInChannel(chanId: number) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
    });
    if (!chan) throw Error("Channel not found");

    const users = await this.prisma.user.findMany({
      where: { channel: { none: { chanId: chan.chanId } } },
    });
    return users;
  }

  async getUsersInChannelExceptUser(chanName: string, @Request() req: any) {
    const usersInChannel = await this.prisma.user.findMany({
      where: {
        channel: {
          some: {
            name: chanName,
          },
        },
        NOT: { id: req.user.id },
      },
    });

    return usersInChannel;
  }

  async getChannelsInCommon(userId: number, chanId: number) {
	const channel = await this.prisma.channel.findUnique({
	  where: { chanId: chanId },
	  include: { members: true },});
	let friendId = -1;
	if (channel) {
	  const friend = channel.members.find((member) => member.id !== userId);
	  if (friend) friendId = friend.id;
	}
	if (friendId === -1) return [];
    const userChannels = await this.prisma.channel.findMany({
      where: {
        members: {
          some: {
            id: userId && friendId,
          },
        },
		NOT: {
			modes: "CHAT",
		  },
      },
    });
    return userChannels;
  }

  async getCommonFriend(userId: number, chanId: number) {
	const channel = await this.prisma.channel.findUnique({
		where: { chanId: chanId },
		include: { members: true },});
	  let friendId = -1;
	  if (channel) {
		const friend = channel.members.find((member) => member.id !== userId);
		if (friend) friendId = friend.id;
	  }
	  if (friendId === -1) return [];
	  const friends = await this.prisma.user.findMany({
		where: {
		  friends: {
			some: {
			  id: userId && friendId,
			},
		  },
		},
	  });
	return friends;
  }

  async addOp(chanId: number, username: string, @Request() req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: { owner: true },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (req.user.username !== chan.owner.username) {
      throw new Error("You are not allowed to add an op to this channel");
    }
    if (chan.op.includes(username)) {
      throw new Error("User is already an op in this channel");
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chanId },
      data: { op: { push: username } },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
        members: true,
        owner: true,
        banned: true,
      },
    });
    const userTarget = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!userTarget) throw new Error("User not found");
    const notificationDto = new CreateNotificationDto();
    notificationDto.privilegeName = "operator";
    notificationDto.channelName = updatedChannel.name;
    await this.notificationService.addNotificationByUserId(
      userTarget.id,
      notificationDto,
      NotificationType.CHANNEL_PRIVILEGE_GRANTED
    );

    return updatedChannel;
  }

  async removeOp(chanId: number, username: string, @Request() req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: { owner: true },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (req.user.username !== chan.owner.username) {
      throw new Error("You are not allowed to add an op to this channel");
    }

    const updatedOp = chan.op.filter((user) => user !== username);
    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chanId },
      data: { op: { set: updatedOp } },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
        members: true,
        owner: true,
        banned: true,
      },
    });
    return updatedChannel;
  }

  async isUserInChannel(@Request() req: any, chanId: number): Promise<boolean> {
    try {
      const userList = await this.findAllMembers(chanId);
	  if (!userList) return false;
      const isInChannel = userList.some((user) => user.id === req.user.id);
      return isInChannel;
    } catch (error) {
      console.error("Error checking user in channel:", error);
      return false;
    }
  }

  async renameChan(chanId: number, newName: string, @Request() req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: { owner: true },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (req.user.username === chan.owner.username || chan.op.includes(req.user.username)) {
      const updatedChannel = await this.prisma.channel.update({
        where: { chanId: chanId },
        data: { name: newName },
      });
      return updatedChannel;
    } else {
      throw new Error("You are not allowed to rename this channel");
    }
  }

  // [username] of the user that is inviting, [targetId] of the user that is being invited
  async inviteUserToChannel(
    chanId: number,
    targetId: number,
    @Request() req: any
  ) {
    const channel = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: { banned: true },
    });
    if (!channel) {
      throw new Error("Could not find channel");
    }
    if (!channel.op.includes(req.user.username)) {
      // verifier si l'owner fait une invite est dans la liste d'op
      throw new Error("You are not allowed to invite a user to this channel");
    }
    const target = await this.prisma.user.findUnique({
      where: { id: targetId },
    });
    if (!target) {
      throw new Error("Could not find user");
    }
    const banned = channel.banned.some(
      (user) => user.username === target.username
    );
    if (banned) {
      throw new Error("User is banned from this channel");
    }
    if (channel.banned.includes(target)) {
      throw new Error("User has been banned from this channel");
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chanId },
      data: { invitedList: { connect: { id: target.id } } },
    });

    const notificationDto = new CreateNotificationDto();
    notificationDto.fromUser = req.user.username;
    notificationDto.channelName = updatedChannel.name;

    await this.notificationService.addNotificationByUserId(
      target.id,
      notificationDto,
      NotificationType.INVITED_TO_CHANNEL
    );

    return updatedChannel;
  }

  async acceptInvitationToChannel(chanId: number, @Request() req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chanId },
      data: {
        members: { connect: { id: req.user.id } },
        invitedList: { disconnect: { id: req.user.id } },
      },
    });
    return updatedChannel;
  }

  async addUsersToChannel(
    chanId: number,
    targets: User[],
    @Request() req: any
  ) {
    const channel = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
        members: true,
        owner: true,
        banned: true,
      },
    });
    if (!channel) {
      throw new Error("Could not find channel");
    }
    const targetIds = targets.map((target) => target.id);
    const users = await this.prisma.user.findMany({
      where: { id: { in: targetIds } },
    });
    if (users.length !== targetIds.length) {
      throw new Error("Could not find all users");
    }
    const bannedUsers = users.filter((user) =>
      channel.banned.some((bannedUser) => bannedUser.id === user.id)
    );
    if (bannedUsers.length > 0) {
      throw new Error("One or more users have been banned from this channel");
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chanId },
      data: {
        members: { connect: users.map((user) => ({ id: user.id })) },
      },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
        members: true,
        owner: true,
        banned: true,
      },
    });

    return updatedChannel;
  }

  async joinChannel(chanId: number, @Request() req: any, password?: string) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
        members: true,
        owner: true,
        banned: true,
      },
    });

    if (!chan) {
      throw new Error("Could not find channel");
    }
    const banned = chan.banned.some(
      (user) => user.username === req.user.username);
    if (banned) {
      throw new Error("You are banned from this channel");
    }
    if (chan.modes === Mode.PROTECTED && password !== undefined) {
		if (chan.password !== null) {
		  const pwdMatches = await argon.verify(chan.password, password);
        try {
          if (!pwdMatches) {
            throw new Error("Wrong password");
          }
        } catch (error) {
          console.error("Error verifying password:", error);
          throw new Error("Error verifying password");
        }
      } else {
        console.error("Hashed password is null.");
        throw new Error("Invalid channel configuration");
      }
    }

    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chanId },
      data: { members: { connect: { id: req.user.id } } },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
        members: true,
        owner: true,
        banned: true,
      },
    });
    return updatedChannel;
  }

  async leaveChannel(chanId: number, @Request() @Request() req: any) {
	  const chan = await this.prisma.channel.findUnique({
		  where: { chanId: chanId },
		  include: {
			  messages: {
				  include: {
					  author: true,
					},
				},
				members: true,
				owner: true,
				banned: true,
			},
		});
		if (!chan) {
			throw new Error("Could not find channel");
		}
	let payload = {room:  chan.name, chan: chan};
    if (req.user.id === chan.owner.id) {
		await this.prisma.channel.delete({
        where: { chanId: chanId },
      });
      return payload;
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chanId },
      data: { members: { disconnect: { id: req.user.id } } },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
        members: true,
        owner: true,
        banned: true,
      },
    });
	payload.chan = updatedChannel;
    return payload;
  }

  async banUser(chanId: number, username: string, @Request() req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: { owner: true, banned: true },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (
      req.user.username !== chan.owner.username &&
      !chan.op.includes(req.user.username)
    ) {
      throw new Error("You are not allowed to ban a user from this channel");
    }
    const target = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!target) {
      throw new Error("Could not find user");
    }
    const banned = chan.banned.some(
      (user) => user.username === target.username
    );
    if (banned) {
      throw new Error("User is already banned from this channel");
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chanId },
      data: {
        banned: { connect: { id: target.id } },
        members: { disconnect: { id: target.id } },
      },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
        members: true,
        owner: true,
        banned: true,
      },
    });
    return updatedChannel;
  }

  async unBanUser(chanId: number, username: string, @Request() req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: { owner: true, banned: true },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (
      req.user.username !== chan.owner.username &&
      !chan.op.includes(req.user.username)
    ) {
      throw new Error("You are not allowed to unban a user from this channel");
    }
    const target = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!target) {
      throw new Error("Could not find user");
    }
    const banned = chan.banned.some(
      (user) => user.username === target.username
    );
    if (!banned) {
      throw new Error("User is not banned from this channel");
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chanId },
      data: {
        banned: { disconnect: { id: target.id } },
      },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
        members: true,
        owner: true,
        banned: true,
      },
    });
    return updatedChannel;
  }

  async kickUser(chanId: number, username: string, @Request() req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: { owner: true },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (
      req.user.username !== chan.owner.username &&
      !chan.op.includes(req.user.username)
    ) {
      throw new Error("You are not allowed to ban a user from this channel");
    }
    const target = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!target) {
      throw new Error("Could not find user");
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chanId },
      data: {
        members: { disconnect: { id: target.id } },
      },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
        members: true,
        owner: true,
        banned: true,
      },
    });
    return updatedChannel;
  }

  async findAllMembers(chanId: number) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: { members: true },
    });
    if (!chan) {
      return null;
    }
    return chan.members;
  }

  async muteMember(chanId: number, userId: number) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
      },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (chan.muted.includes(userId)) {
      throw new Error("User is already muted in this channel");
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chan.chanId },
      data: { muted: { set: [...chan.muted, userId] } },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
        members: true,
        owner: true,
      },
    });
    return updatedChannel;
  }

  async unMuteMember(chanId: number, userId: number) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (!chan.muted.includes(userId)) {
      throw new Error("User is not muted in this channel");
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chan.chanId },
      data: { muted: { set: chan.muted.filter((id) => id !== userId) } },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
        members: true,
        owner: true,
      },
    });
    return updatedChannel;
  }

  async findAllMutedMembers(chanId: number) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    const mutedList = await this.prisma.user.findMany({
      where: { id: { in: chan.muted } },
    });
    return mutedList;
  }

  async findAllBannedMembers(chanId: number) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: { banned: true },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    return chan.banned;
  }

  async createMessage(
    createMessageDto: CreateMessageDto,
    @Request() req: any
  ): Promise<Message> {
    const { content, chanName } = createMessageDto;
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
      include: { banned: true, members: true },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    const target = await this.prisma.user.findUnique({
      where: { username: req.user.username },
    });
    if (!target) {
      throw new Error("Could not find user");
    } else if (chan.banned.some((user) => user.username === target.username)) {
      throw new Error("User has been banned from this channel");
    } else {
      const message = await this.prisma.message.create({
        data: {
          content: content,
          channel: { connect: { name: chan.name } },
          author: { connect: { id: target.id } },
        },
        include: { author: true },
      });
      const memberslist = chan.members.filter((user) => user.id !== target.id);
      const memberArray = memberslist.map((user) =>
        user.username !== null ? user.username : ""
      );

      if (memberArray && memberArray.length > 0) {
        await this.prisma.channel.update({
          where: { name: chanName },
          data: {
            updatedAt: new Date(),
            read: { set: memberArray },
          },
        });
      }
      return message;
    }
  }

  async read(chanId: number, username: string) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
    });
    const memberslist = chan?.read.filter((user) => user !== username);
    if (memberslist) {
      await this.prisma.channel.update({
        where: { chanId: chanId },
        data: {
          read: { set: memberslist },
        },
      });
    }
  }

  async isUnRead(chanName: string, username: string) {
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    const target = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!target) {
      throw new Error("Could not find user");
    }
    const unread = chan.read.some((user) => user === target.username);
    return unread;
  }

  // changer pour chanId ici
  async findAllChanMessages(chanName: string): Promise<Message[]> {
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    const messages = await this.prisma.message.findMany({
      where: { channelName: chanName },
      include: { author: true },
    });
    return messages;
  }

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

  async removeMessages(chanName: string, msgId: number, @Request() req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { name: chanName },
      include: { owner: true },
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
      req.user !== chan.owner &&
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
