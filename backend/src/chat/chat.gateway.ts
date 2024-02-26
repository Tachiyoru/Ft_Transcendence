import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { chatService } from "./chat.service";
import {
  CreateMessageDto,
  UpdateMessageDto,
  createChannel,
} from "./dto/create-message.dto";
import { Server, Socket } from "socket.io";
import { Request, UseGuards } from "@nestjs/common";
import { Mode, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { addUserToChannelDto } from "./dto/add-to-channel.dto";
import { SocketTokenGuard } from "src/auth/guard/socket-token.guard";
import { CreateNotificationDto } from "src/notification/dto/create-notification.dto";
import { NotificationType } from "src/notification/content-notification";
import { NotificationService } from "src/notification/notification.service";

@WebSocketGateway({
  cors: { origin: "http://paul-f4ar1s1:5173", credentials: true },
})
@UseGuards(SocketTokenGuard)
export class chatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly chatService: chatService,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService
  ) {}

  connectedUsers: string[] = [];

  handleConnection(client: Socket) {
    const userId = client.id;
    this.connectedUsers.push(userId);
    console.log(`Chat Client connected: ${userId}`);
  }

  @SubscribeMessage("gotDisconnected")
  handleDisconnect(client: Socket) {
    const userId = client.id;
    this.connectedUsers = this.connectedUsers.filter((id) => id !== userId);
    console.log(`Client disconnected: ${userId}`);
  }

  @SubscribeMessage("channel")
  async getChannelById(
    @ConnectedSocket() client: Socket,
    @MessageBody("id") id: number,
    @MessageBody("prev") prevId: number
  ) {
    if (!id) throw Error("id not found");
    const chan = await this.prisma.channel.findUnique({
      where: { chanId: id },
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
    if (!chan) return null;
    const messagesList = chan.messages;
    if (prevId) {
      const chan2 = await this.prisma.channel.findUnique({
        where: { chanId: prevId },
      });
      if (!chan2) return null;
      client.leave(chan2.name);
    }
    client.join(chan.name);
    this.server.to(chan.name).emit("channel", chan, messagesList);
  }

  @SubscribeMessage("editChannel")
  async editChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody("id") id: number,
    @MessageBody("updatedSettings") updatedSettings: Partial<createChannel>,
    @Request() req: any
  ) {
    try {
      if (!id) throw new Error("id not found");

      const updatedChannel = await this.chatService.editChannel(
        id,
        updatedSettings,
        req
      );
      client.emit("edit-channel", updatedChannel);
      this.allUpdate();
    } catch (error) {
      console.error("Error editing channel:", error.message);
      client.emit("channelError", {
        message: "Error editing channel",
        error: error.message,
      });
    }
  }

  @SubscribeMessage("getOrCreateChatChannel")
  async handleGetOrCreateChatChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody("username2") username2: string,
    @MessageBody("id") id: number,
    @Request() req: any
  ) {
    try {
      const channelId = await this.chatService.getOrCreateChatChannel(
        req,
        username2,
        id
      );
      client.emit("chatChannelCreated", { channelId });
    } catch (error) {
      console.error(
        `Error creating or retrieving chat channel: ${error.message}`
      );
      client.emit("chatChannelError", {
        message: "Error creating or retrieving chat channel",
        error: error.message,
      });
    }
  }

  @SubscribeMessage("check-user-in-channel")
  async isUserInChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number },
    @Request() req: any
  ) {
    try {
      const userList = await this.chatService.isUserInChannel(req, data.chanId);
      client.emit("user-in-channel", userList);
    } catch (error) {
      client.emit("user-in-channel-error", error.message);
    }
  }

  @SubscribeMessage("users-not-in-channel")
  async getUsersNotInChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number }
  ) {
    try {
      const userList = await this.chatService.getUsersNotInChannel(data.chanId);
      client.emit("users-not-in-channel", userList);
    } catch (error) {
      client.emit("users-not-in-channel-error", error.message);
    }
  }

  @SubscribeMessage("users-in-channel-except-him")
  async getUsersNotInChannelExceptUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanName: string },
    @Request() req: any
  ) {
    try {
      const userList = await this.chatService.getUsersInChannelExceptUser(
        data.chanName,
        req
      );
      client.emit("users-in-channel-except-him", userList);
    } catch (error) {
      client.emit("users-in-channel-except-him-error", error.message);
    }
  }

  @SubscribeMessage("createChannel")
  async createchan(
    @ConnectedSocket() client: Socket,
    @MessageBody("settings") settings: createChannel,
    @MessageBody()
    data: {
      chanName: string;
      users: User[];
      mode: Mode;
      password?: string;
      name?: string;
    },
    @Request() req: any
  ) {
    try {
      const chan = await this.chatService.createChannel(settings, req);
      client.emit("channelCreated", chan);
      this.allUpdate();
      client.join(chan.name);
    } catch (error) {
      client.emit("channelCreateError", {
        error: "Could not create channel because :",
        message: error.message,
      });
    }
  }

  @SubscribeMessage("invite-to-channel")
  async inviteUserToChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      chanId: number;
      targetId: number;
    },
    @Request() req: any
  ) {
    try {
      const result = await this.chatService.inviteUserToChannel(
        data.chanId,
        data.targetId,
        req
      );
      client.emit("userInvited", result);
    } catch (error) {
      client.emit("inviteError", { message: error.message });
    }
  }

  @SubscribeMessage("add-user")
  async addUserToChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody("channelData") channelData: addUserToChannelDto,
    @Request() req: any
  ) {
    try {
      const result = await this.chatService.addUsersToChannel(
        channelData.chanId,
        channelData.targets,
        req
      );
      const me = await this.prisma.user.findUnique({
        where: { id: client.handshake.auth.id },
      });
      if (!me || !me.username) throw Error("user not found");

      const notificationDto = new CreateNotificationDto();
      notificationDto.fromUser = me.username;
      notificationDto.channelName = result.name;

      for (let i = 0; i < channelData.targets.length; i++) {
        await this.notificationService.addNotificationByUserId(
          channelData.targets[i].id,
          notificationDto,
          NotificationType.INTEGRATED_TO_CHANNEL
        );
      }
    //   client.emit("usersAdded", result);
	const chanlist = await this.prisma.channel.findMany();
    const emitPromises = this.connectedUsers.map(async (element) => {
      await this.server.to(element).emit("update-call");
      await this.server.to(element).emit("actu");
      await this.server.to(element).emit("actu-notif");
    });
      this.server.emit("channel", result, result.messages);
    } catch (error) {
      client.emit("addUsersError", { message: error.message });
    }
  }

  @SubscribeMessage("addOp")
  async addOp(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number; username: string },
    @Request() req: any
  ) {
    try {
      const result = await this.chatService.addOp(
        data.chanId,
        data.username,
        req
      );
      this.server.emit("opAdded", result);
      this.server.emit("channel", result, result.messages);
    } catch (error) {
      client.emit("addOpError", { message: error.message });
    }
  }

  @SubscribeMessage("removeOp")
  async removeOp(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number; username: string },
    @Request() req: any
  ) {
    try {
      const result = await this.chatService.removeOp(
        data.chanId,
        data.username,
        req
      );
      this.server.emit("opRemoved", result);
      this.server.emit("channel", result, result.messages);
    } catch (error) {
      client.emit("removeOpError", { message: error.message });
    }
  }

  @SubscribeMessage("renameChan")
  async renameChan(
    client: Socket,
    @MessageBody() data: { chanId: number; newName: string },
    @Request() req: any
  ) {
    try {
      const result = await this.chatService.renameChan(
        data.chanId,
        data.newName,
        req
      );
      this.allUpdate();
    } catch (error) {
      client.emit("renameChanError", { message: error.message });
    }
  }

  @SubscribeMessage("find-all-channels")
  async findAllChannels(): Promise<void> {
    const chanlist = await this.prisma.channel.findMany();
    this.server.emit("channel-list", chanlist);
  }

  @SubscribeMessage("find-my-channels")
  async getMyChannels(@ConnectedSocket() client: Socket): Promise<void> {
    const chanlist = await this.chatService.getChannelsByUserId(
      client.handshake.auth.id
    );
    client.emit("my-channel-list", chanlist);
  }

  @SubscribeMessage("all-update")
  async allUpdate(): Promise<void> {
	const chanlist = await this.prisma.channel.findMany();
    const emitPromises = this.connectedUsers.map(async (element) => {
      await this.server.to(element).emit("update-call");
      await this.server.to(element).emit("actu");
      await this.server.to(element).emit("actu-notif");
    });
    await Promise.all(emitPromises);
  }

  @SubscribeMessage("find-channels-public-protected")
  async getChannelsPublicProtected(
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    const chanlist = await this.chatService.getGroupChatChannelsUserIsNotIn(
      client.handshake.auth.id
    );
    client.emit("channel-public-protected-list", chanlist);
  }

  @SubscribeMessage("channel-in-common")
  async getChannelsInCommon(
    @ConnectedSocket() client: Socket,
    @MessageBody("chanId") chanId: number
  ): Promise<void> {
    const chanlist = await this.chatService.getChannelsInCommon(
      client.handshake.auth.id,
      chanId
    );
    client.emit("channel-in-common", chanlist);
  }

  @SubscribeMessage("friends-in-common")
  async getCommonFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody("chanId") chanId: number
  ): Promise<void> {
    const chanlist = await this.chatService.getCommonFriend(
      client.handshake.auth.id,
      chanId
    );
    client.emit("friends", chanlist);
  }

  @SubscribeMessage("joinChan")
  async joinChan(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { chanId: number; password?: string },
    @Request() req: any
  ) {
    try {
      const result = await this.chatService.joinChannel(
        data.chanId,
        req,
        data.password
      );
      client.emit("channelJoined", result);
      this.server.emit("channel", result, result.messages);
      const chanlist = await this.chatService.getGroupChatChannelsUserIsNotIn(
        client.handshake.auth.id
      );
      client.emit("channel-public-protected-list", chanlist);
    } catch (error) {
      client.emit("channelJoinedError", { message: error.message });
    }
  }

  @SubscribeMessage("leaveChan")
  async leaveChan(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number },
    @Request() req: any
  ) {
    try {
      const result = await this.chatService.leaveChannel(data.chanId, req);
      client.emit("channelLeft", result);
      if (result.chan) {
        this.server.emit("channel", result.chan, result.chan.messages);
      }
      this.server.emit("channel", null, null);
      await this.server.to(result.room).emit("update-call");
    } catch (error) {
      client.emit("chanLeftError", { message: error.message });
    }
  }

  @SubscribeMessage("banUser")
  async banUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number; username: string },
    @Request() req: any
  ) {
    try {
      const result = await this.chatService.banUser(
        data.chanId,
        data.username,
        req
      );
      client.emit("userBanned", result);
	  const chanlist = await this.prisma.channel.findMany();
	  const emitPromises = this.connectedUsers.map(async (element) => {
		await this.server.to(element).emit("update-call");
		await this.server.to(element).emit("actu");
	  });
      this.server.emit("channel", result, result.messages);
    } catch (error) {
      client.emit("banUserError", { message: error.message });
    }
  }

  @SubscribeMessage("unBanUser")
  async unBanUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number; username: string },
    @Request() req: any
  ) {
    try {
      const result = await this.chatService.unBanUser(
        data.chanId,
        data.username,
        req
      );
      client.emit("userUnBanned", result);
	  const chanlist = await this.prisma.channel.findMany();
	  const emitPromises = this.connectedUsers.map(async (element) => {
		await this.server.to(element).emit("update-call");
		await this.server.to(element).emit("actu");
	  });
      this.server.emit("channel", result, result.messages);
    } catch (error) {
      client.emit("unBanUserError", { message: error.message });
    }
  }

  @SubscribeMessage("kickUser")
  async kickUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number; username: string },
    @Request() req: any
  ) {
    try {
      const result = await this.chatService.kickUser(
        data.chanId,
        data.username,
        req
      );
      client.emit("userKicked", result);
	  const chanlist = await this.prisma.channel.findMany();
	  const emitPromises = this.connectedUsers.map(async (element) => {
		await this.server.to(element).emit("update-call");
		await this.server.to(element).emit("actu");
	  });
      this.server.emit("channel", result, result.messages);
    } catch (error) {
      client.emit("kickUserError", { message: error.message });
    }
  }

  @SubscribeMessage("findAllMembers")
  async findAllMembers(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number }
  ) {
    try {
      const memberList = await this.chatService.findAllMembers(data.chanId);
      client.emit("allMembers", memberList);
    } catch (error) {
      client.emit("findAllMembersError", { message: error.message });
    }
  }

  @SubscribeMessage("findAllUsers")
  async findAllUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number }
  ) {
    try {
      const UserList = await this.prisma.user.findMany();
      client.emit("allUsers", UserList);
    } catch (error) {
      client.emit("findAllUsersError", { message: error.message });
    }
  }

  @SubscribeMessage("muteMember")
  async muteMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number; userId: number }
  ) {
    try {
      const result = await this.chatService.muteMember(
        data.chanId,
        data.userId
      );
      this.server.emit("memberMuted", result);
      this.server.emit("channel", result, result.messages);
    } catch (error) {
      client.emit("muteMemberError", { message: error.message });
    }
  }

  @SubscribeMessage("unMuteMember")
  async unMuteMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number; userId: number }
  ) {
    try {
      const result = await this.chatService.unMuteMember(
        data.chanId,
        data.userId
      );
      this.server.emit("memberUnMuted", result);
      this.server.emit("channel", result, result.messages);
    } catch (error) {
      client.emit("muteMemberError", { message: error.message });
    }
  }

  @SubscribeMessage("findAllMutedMembers")
  async findAllMutedMembers(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number }
  ) {
    try {
      const mutedList = await this.chatService.findAllMutedMembers(data.chanId);
      this.server.emit("allMuted", mutedList);
    } catch (error) {
      client.emit("findAllMembersError", { message: error.message });
    }
  }

  @SubscribeMessage("findAllBannedMembers")
  async findAllBannedMembers(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanId: number }
  ) {
    try {
      const bannedList = await this.chatService.findAllBannedMembers(
        data.chanId
      );
      client.emit("allMembersBan", bannedList);
    } catch (error) {
      client.emit("findAllMembersError", { message: error.message });
    }
  }

  @SubscribeMessage("recapMessages")
  async findAllChanMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanName: string }
  ) {
    try {
      const messagesList = await this.chatService.findAllChanMessages(
        data.chanName
      );
      client.emit("findAllMessage", messagesList);
    } catch (error) {
      client.emit("findAllMessageError", error.message);
    }
  }
  @SubscribeMessage("create-message")
  async createMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
    @Request() req: any
  ) {
    try {
      const message = await this.chatService.createMessage(
        createMessageDto,
        req
      );
      this.server.to(message.channelName).emit("recapMessages", message);
      this.allUpdate();
    } catch (error) {
      client.emit("createMsgError", { message: error.message });
    }
  }

  @SubscribeMessage("updateMessage")
  async updateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() UpdateMessageDto: UpdateMessageDto,
    @Request() req: any
  ) {
    try {
      this.chatService.updateMessage(UpdateMessageDto, req);
      this.server.emit("messageUpdated");
    } catch (error) {
      client.emit("createMsgError", { message: error.message });
    }
  }

  @SubscribeMessage("removeMessage")
  async removeMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chanName: string; msgId: number },
    @Request() req: any
  ) {
    try {
      await this.chatService.removeMessages(data.chanName, data.msgId, req);
      client.emit("allMembers", { message: "Message removed" });
    } catch (error) {
      client.emit("findAllMembersError", { message: error.message });
    }
  }

  @SubscribeMessage("typing")
  async typing(
    @MessageBody() chanName: string,
    @ConnectedSocket() client: Socket
  ) {
    const username = client.handshake.auth.username;
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) return;
    const name = user.username;
    this.server.to(chanName).except(client.id).emit("typing", username);
  }

  @SubscribeMessage("read")
  async read(@MessageBody() chanId: number, @ConnectedSocket() client: Socket) {
    const username = client.handshake.auth.username;
    await this.chatService.read(chanId, username);
    this.allUpdate();
  }

  @SubscribeMessage("un-read")
  async unRead(
    @MessageBody() chanName: string,
    @ConnectedSocket() client: Socket
  ) {
    const username = client.handshake.auth.username;
    if (!(await this.chatService.isUnRead(chanName, username))) return false;
    else return true;
  }
}
