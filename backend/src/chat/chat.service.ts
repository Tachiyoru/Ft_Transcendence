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
import { NotificationService } from "src/notification/notification.service";
import { NotificationType } from "src/notification/content-notification";
import { CreateNotificationDto } from "src/notification/dto/create-notification.dto";
import { Server, Socket } from "socket.io";

@Injectable()
export class chatService {
  constructor(
    private readonly prisma: PrismaService,
    private notificationService: NotificationService
  ) {}

  async createChannel(settings: createChannel, @Request() req: any) {
    const channelName =
      settings.members.map((user) => user.username).join(", ") +
      ", " +
      req.user.username;

    const existingChannel = await this.prisma.channel.findUnique({
      where: { name: channelName },
    });
    if (!channelName) {
      throw new Error("Invalid channel name");
    }

    if (existingChannel) {
      throw new Error("Channel's name is already taken");
    }

    const hashedPassword: string = settings.password
      ? await argon.hash(settings.password)
      : "";

		const channel: Channel = await this.prisma.channel.create({
			data: {
				name: channelName,
				modes: settings.mode,
				password: hashedPassword,
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

	async editChannel(channelId: number, updatedSettings: Partial<createChannel>, @Request() req: any) {
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

	async getOrCreateChatChannel(@Request() req: any, username2: string, id: number): Promise<number> {
		;
	
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
				modes: 'CHAT',
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
			modes: 'CHAT',
			owner: { connect: { id: req.user.id } }, 
			members: {
			  connect: [
				{ id: req.user.id },
				{ id: id },
			  ],
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
            modes: "CHAT",
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

  async getUsersInChannel(chanName: string, @Request() req: any) {
    const usersInChannel = await this.prisma.user.findMany({
      where: {
        channel: {
          some: {
            name: chanName,
          },
        },
      },
    });

    return usersInChannel;
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

  async getChannelsInCommon(userId: number, friendId: number) {
    const userChannels = await this.prisma.channel.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    });

    const friendChannels = await this.prisma.channel.findMany({
      where: {
        members: {
          some: {
            id: friendId,
          },
        },
        NOT: {
          modes: "CHAT",
        },
      },
    });

    if (!userChannels || !friendChannels) return [];

    const channelsInCommon = userChannels.filter((channel) =>
      friendChannels.some(
        (friendChannel) => friendChannel.chanId === channel.chanId
      )
    );

    return channelsInCommon;
  }

	async addOp(
		chanId: number,
		username: string,
		@Request() req: any
	)
	{
		const chan = await this.prisma.channel.findUnique({
			where: { chanId: chanId },
			include: { owner: true },
		});
		if (!chan)
		{
			throw new Error("Could not find channel");
		}
		if (req.user.username !== chan.owner.username)
		{
			throw new Error("You are not allowed to add an op to this channel");
		}
		if (chan.op.includes(username))
		{
			throw new Error("User is already an op in this channel");
		}
		const updatedChannel = await this.prisma.channel.update({
			where: { chanId: chanId },
			data: { op: { push: username } },
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

  async renameChan(chanId: number, newName: string, @Request() req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: { owner: true },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (req.user === chan.owner || chan.op.includes(req.user.username)) {
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
      include: { banned: true, invitedList: true },
    });

    if (!channel) {
      throw new Error("Could not find channel");
    }

    // if (!channel.op.includes(req.user.username))
    // {
    // 	throw new Error("You are not allowed to invite users to this channel");
    // }
    // if (!channel.op.includes(req.user.username))
    // {
    // 	throw new Error("You are not allowed to invite users to this channel");
    // }

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
    });

    return updatedChannel;
  }

  async joinChannel(
    chanId: number,
    invited: boolean,
    @Request() req: any,
    password?: string
  ) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: { owner: true, banned: true },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (chan.banned.includes(req.user)) {
      throw new Error("You are banned from this channel");
    }
    if (chan.modes === Mode.CHAT) {
    } else if (chan.modes === Mode.GROUPCHAT) {
    } else if (chan.modes === Mode.PRIVATE) {
    } else if (chan.modes === Mode.PROTECTED) {
      const hashedPassword: string = password ? await argon.hash(password) : "";
      if (hashedPassword !== chan.password) {
        throw new Error("Wrong password");
      }
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chanId },
      data: { members: { connect: { id: req.user.id } } },
    });
    return updatedChannel;
  }

  async leaveChannel(chanId: number, @Request() @Request() req: any) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: { owner: true },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    if (req.user === chan.owner) {
      await this.prisma.channel.delete({
        where: { chanId: chanId },
      });
      return {
        success: true,
        message: `Channel ${chan.name} deleted successfully`,
      };
    }
    const updatedChannel = await this.prisma.channel.update({
      where: { chanId: chanId },
      data: { members: { disconnect: { id: req.user.id } } },
    });
    return updatedChannel;
  }

	async banUser(
		chanId: number,
		username: string,
		@Request() req: any
	)
	{
		const chan = await this.prisma.channel.findUnique({
			where: { chanId: chanId },
			include: { owner: true, banned: true },
		});
		if (!chan)
		{
			throw new Error("Could not find channel");
		}
		if (req.user.username !== chan.owner.username && !chan.op.includes(req.user.username))
		{
			throw new Error("You are not allowed to ban a user from this channel");
		}
		const target = await this.prisma.user.findUnique({
			where: { username: username },
		});
		if (!target)
		{
			throw new Error("Could not find user");
		}
		if (chan.banned.includes(target))
		{
			throw new Error("User is already banned from this channel");
		}
		const updatedChannel = await this.prisma.channel.update({
			where: { chanId: chanId },
			data: {
				banned: { connect: { id: target.id } },
				members: { disconnect: { id: target.id } },
			},
		});
		return updatedChannel;
	}

	async unBanUser(
		chanId: number,
		username: string,
		@Request() req: any
	)
	{
		const chan = await this.prisma.channel.findUnique({
			where: { chanId: chanId },
			include: { owner: true, banned: true },
		});
		if (!chan)
		{
			throw new Error("Could not find channel");
		}
		if (req.user.username !== chan.owner.username && !chan.op.includes(req.user.username))
		{
			throw new Error("You are not allowed to unban a user from this channel");
		}
		const target = await this.prisma.user.findUnique({
			where: { username: username },
		});
		if (!target)
		{
			throw new Error("Could not find user");
		}
		const banned = chan.banned.some((user) => user.username === target.username)
		if (!banned)
		{
			console.log('pas ok', chan.banned, target)
			throw new Error("User is not banned from this channel");
	}
		console.log('ok')
		const updatedChannel = await this.prisma.channel.update({
			where: { chanId: chanId },
			data: {
				banned: { disconnect: { id: target.id } },
			},
		});
		return (updatedChannel);
	}

	async kickUser(
		chanId: number,
		username: string,
		@Request() req: any
	)
	{
		const chan = await this.prisma.channel.findUnique({
			where: { chanId: chanId },
			include: { owner: true },
		});
		if (!chan)
		{
			throw new Error("Could not find channel");
		}
		if (req.user.username !== chan.owner.username && !chan.op.includes(req.user.username))
		{
			throw new Error("You are not allowed to ban a user from this channel");
		}
		const target = await this.prisma.user.findUnique({
			where: { username: username },
		});
		if (!target)
		{
			throw new Error("Could not find user");
		}
		const updatedChannel = await this.prisma.channel.update({
			where: { chanId: chanId },
			data: {
				members: { disconnect: { id: target.id } },
			},
		});
		return (updatedChannel);
	}

  async findAllMembers(chanId: number) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
      include: { members: true },
    });
    if (!chan) {
      throw new Error("Could not find channel");
    }
    return chan.members;
  }

  async muteMember(chanId: number, userId: number) {
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: chanId },
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
      await this.prisma.channel.update({
        where: { name: chanName },
        data: { updatedAt: new Date() },
      });
      return message;
    }
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
    });
    return messages;
  }

  // si chan.banned ne fonctionne pas utiliser la fonction interne au service pour vérifier
  // si l'user est ban .some((user) => user.username === req.user.username)
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
