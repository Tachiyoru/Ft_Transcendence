import
{
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	ConnectedSocket,
} from "@nestjs/websockets";
import { chatService } from "./chat.service";
import
{
	CreateMessageDto,
	UpdateMessageDto,
	createChannel,
} from "./dto/create-message.dto";
import { Server, Socket } from "socket.io";
import { Request, UseGuards } from "@nestjs/common";
import { Channel, Mode, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { channel } from "diagnostics_channel";
import { SocketTokenGuard } from "src/auth/guard/sockettoken.guard";

@WebSocketGateway({
	cors: { origin: "http://localhost:5173", credentials: true },
})
export class chatGateway
{
	@WebSocketServer()
	server: Server;
	constructor(
		private readonly chatService: chatService,
		private readonly prisma: PrismaService
	) {}

	@UseGuards(SocketTokenGuard)
	@SubscribeMessage("createChannel")
	async createchan(
		@ConnectedSocket() client: Socket,
		@MessageBody("settings") settings: createChannel,
		@MessageBody() data: { chanName: string; users: User[]; mode: Mode },
		@Request() req: any
	)
	{
		try
		{
			const chan = await this.chatService.createChannel(settings, req);
			client.emit("channelCreated", chan);
			const chanlist = await this.prisma.channel.findMany();
			console.log("chan list = ", chanlist);
			client.join(chan.name);
		} catch (error)
		{
			client.emit("channelCreateError", {
				error: "Could not create channel because :",
				message: error.message,
			});
		}
	}

	//   @SubscribeMessage("addOp")
	//   async addOp(
	//     client: Socket,
	//     @MessageBody() data: { chanName: string; username: string },
	//     @Request() req: any
	//   ) {
	//     try {
	//       const owner = await channel
	//         .caller(
	//           this.prisma.channel.findUnique({ where: { name: data.chanName } })
	//         )
	//         .owner();
	//       const result = await this.chatService.addOp(
	//         data.chanName,
	//         data.username,
	//         owner,
	//         req
	//       );
	//       client.emit("opAdded", result);
	//     } catch (error) {
	//       client.emit("addOpError", { message: error.message });
	//     }
	//   }

	//   @SubscribeMessage("renameChan")
	//   async renameChan(
	//     client: Socket,
	//     @MessageBody() data: { chanName: string; newName: string },
	//     @Request() req: any
	//   ) {
	//     try {
	//       const owner = await channel
	//         .caller(
	//           this.prisma.channel.findUnique({ where: { name: data.chanName } })
	//         )
	//         .owner();
	//       const result = await this.chatService.renameChan(
	//         data.chanName,
	//         data.newName,
	//         owner,
	//         req
	//       );
	//       client.emit("channelRenamed", result);
	//     } catch (error) {
	//       client.emit("renameChanError", { message: error.message });
	//     }
	//   }

	@SubscribeMessage("findAllChannels")
	async findAllChannels(): Promise<void>
	{
		const chanlist = await this.prisma.channel.findMany();
		this.server.emit("channelList", chanlist);
	}

	@SubscribeMessage("invite")
	async inviteUserToChannel(
		client: Socket,
		@MessageBody() data: { chanName: string; userId: number },
		@Request() req: any
	)
	{
		try
		{
			const result = await this.chatService.inviteUserToChannel(
				data.chanName,
				data.userId,
				req
			);
			client.emit("userInvited", result);
		}
		catch (error)
		{
			client.emit("inviteError", { message: error.message });
		}
	}

	//   @SubscribeMessage("joinChan")
	//   async joinChan(
	//     client: Socket,
	//     @MessageBody()
	//     data: { chanName: string; password?: string; invited?: boolean },
	//     @Request() req: any
	//   ) {
	//     try {
	//       if (!data.invited) {
	//         data.invited = false;
	//       }
	//       const result = await this.chatService.joinChannel(
	//         data.chanName,
	//         data.invited,
	//         req,
	//         data.password
	//       );
	//       client.emit("channelJoined", result);
	//     } catch (error) {
	//       client.emit("renameChanError", { message: error.message });
	//     }
	//   }

	//   @SubscribeMessage("leaveChan")
	//   async leaveChan(
	//     client: Socket,
	//     @MessageBody() data: { chanName: string },
	//     @Request() req: any
	//   ) {
	//     try {
	//       const owner = await channel
	//         .caller(
	//           this.prisma.channel.findUnique({ where: { name: data.chanName } })
	//         )
	//         .owner();
	//       const result = await this.chatService.leaveChannel(
	//         data.chanName,
	//         owner,
	//         req
	//       );
	//       client.emit("channelLeft", result);
	//     } catch (error) {
	//       client.emit("chanLeftError", { message: error.message });
	//     }
	//   }
	//   @SubscribeMessage("banUser")
	//   async banUser(
	//     client: Socket,
	//     @MessageBody() data: { chanName: string; username: string },
	//     @Request() req: any
	//   ) {
	//     try {
	//       const owner = await channel
	//         .caller(
	//           this.prisma.channel.findUnique({ where: { name: data.chanName } })
	//         )
	//         .owner();
	//       const banlist = await channel
	//         .caller(
	//           this.prisma.channel.findUnique({ where: { name: data.chanName } })
	//         )
	//         .banned();
	//       const result = await this.chatService.banUser(
	//         data.chanName,
	//         data.username,
	//         banlist,
	//         owner,
	//         req
	//       );
	//       client.emit("userBanned", result);
	//     } catch (error) {
	//       client.emit("banUserError", { message: error.message });
	//     }
	//   }

	//   @SubscribeMessage("unBanUser")
	//   async unBanUser(
	//     client: Socket,
	//     @MessageBody() data: { chanName: string; username: string },
	//     @Request() req: any
	//   ) {
	//     try {
	//       const owner = await channel
	//         .caller(
	//           this.prisma.channel.findUnique({ where: { name: data.chanName } })
	//         )
	//         .owner();
	//       const banlist = await channel
	//         .caller(
	//           this.prisma.channel.findUnique({ where: { name: data.chanName } })
	//         )
	//         .banned();
	//       const result = await this.chatService.unBanUser(
	//         data.chanName,
	//         data.username,
	//         banlist,
	//         owner,
	//         req
	//       );
	//       client.emit("userUnBanned", result);
	//     } catch (error) {
	//       client.emit("unBanUserError", { message: error.message });
	//     }
	//   }

	//   @SubscribeMessage("kickUser")
	//   async kickUser(
	//     client: Socket,
	//     @MessageBody() data: { chanName: string; username: string },
	//     @Request() req: any
	//   ) {
	//     try {
	//       const owner = await channel
	//         .caller(
	//           this.prisma.channel.findUnique({ where: { name: data.chanName } })
	//         )
	//         .owner();
	//       const result = await this.chatService.kickUser(
	//         data.chanName,
	//         data.username,
	//         owner,
	//         req
	//       );
	//       client.emit("userKicked", result);
	//     } catch (error) {
	//       client.emit("kickUserError", { message: error.message });
	//     }
	//   }

	//   @SubscribeMessage("findAllMembers")
	//   async findAllMembers(
	//     client: Socket,
	//     @MessageBody() data: { chanName: string }
	//   ) {
	//     try {
	//       const memberList = await channel
	//         .caller(this.prisma.channel.findMany({}))
	//         .members();
	//       client.emit("allMembers", memberList);
	//     } catch (error) {
	//       client.emit("findAllMembersError", { message: error.message });
	//     }
	//   }

	@SubscribeMessage("findAllUsers")
	async findAllUsers(
		client: Socket,
		@MessageBody() data: { chanName: string }
	)
	{
		try
		{
			const UserList = await this.prisma.user.findMany();
			client.emit("allUsers", UserList);
		} catch (error)
		{
			client.emit("findAllUsersError", { message: error.message });
		}
	}

	//   @SubscribeMessage("findAllBannedMembers")
	//   async findAllBannedMembers(
	//     client: Socket,
	//     @MessageBody() data: { chanName: string }
	//   ) {
	//     try {
	//       const bannedList = await channel
	//         .caller(this.prisma.channel.findMany({}))
	//         .banned();
	//       client.emit("allMembers", bannedList);
	//     } catch (error) {
	//       client.emit("findAllMembersError", { message: error.message });
	//     }
	//   }

	//   @SubscribeMessage("findAllMessages")
	//   async findAllChanMessages(
	//     client: Socket,
	//     @MessageBody() data: { chanName: string }
	//   ) {
	//     try {
	//       const messagesList = await channel
	//         .caller(this.prisma.channel.findMany({}))
	//         .messages();
	//       client.emit("allMembers", messagesList);
	//     } catch (error) {
	//       client.emit("findAllMembersError", { message: error.message });
	//     }
	//   }

	//   @SubscribeMessage("createMessage")
	//   async createMessage(
	//     @ConnectedSocket() client: Socket,
	//     @MessageBody() createMessageDto: CreateMessageDto,
	//     @Request() req: any
	//   ) {
	//     try {
	//       const message = await this.chatService.createMessage(
	//         createMessageDto,
	//         req
	//       );
	//       this.server.emit("newMessage", message);
	//     } catch (error) {
	//       client.emit("createMsgError", { message: error.message });
	//     }
	//   }

	//   @SubscribeMessage("updateMessage")
	//   async updateMessage(
	//     client: Socket,
	//     @MessageBody() UpdateMessageDto: UpdateMessageDto,
	//     @Request() req: any
	//   ) {
	//     try {
	//       this.chatService.updateMessage(UpdateMessageDto, req);
	//       this.server.emit("messageUpdated");
	//     } catch (error) {
	//       client.emit("createMsgError", { message: error.message });
	//     }
	//   }

	//   @SubscribeMessage("removeMessage")
	//   async removeMessages(
	//     client: Socket,
	//     @MessageBody() data: { chanName: string; msgId: number },
	//     @Request() req: any
	//   ) {
	//     try {
	//       const owner = await channel
	//         .caller(
	//           this.prisma.channel.findUnique({ where: { name: data.chanName } })
	//         )
	//         .owner();
	//       await this.chatService.removeMessages(
	//         data.chanName,
	//         data.msgId,
	//         owner,
	//         req
	//       );
	//       client.emit("allMembers", { message: "Message removed" });
	//     } catch (error) {
	//       client.emit("findAllMembersError", { message: error.message });
	//     }
	//   }

	//   @SubscribeMessage("typing")
	//   async typing(
	//     @MessageBody("isTyping") isTyping: boolean,
	//     @MessageBody("user") username: string,
	//     @ConnectedSocket() client: Socket
	//   ) {
	//     const user = await this.prisma.user.findUnique({
	//       where: { username: username },
	//     });
	//     if (!user) {
	//       return;
	//     }
	//     const name = user.username;
	//     client.broadcast.emit("typing", { name, isTyping });
	//   }
}
