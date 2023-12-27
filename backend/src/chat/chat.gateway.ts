import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	ConnectedSocket,
} from "@nestjs/websockets";
import { chatService } from "./chat.service";
import {
	CreateMessageDto,
	UpdateMessageDto,
	createChannel,
	} from "./dto/create-message.dto";
import { Server, Socket } from "socket.io";
import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Request,
	UseGuards,
} from "@nestjs/common";
import { Channel, Mode, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { channel } from "diagnostics_channel";
import { addUserToChannelDto } from "./dto/add-to-channel.dto";
import { SocketTokenGuard } from "src/auth/guard/socket-token.guard";

@WebSocketGateway({
	cors: { origin: "http://localhost:5173", credentials: true },
})
@UseGuards(SocketTokenGuard)
export class chatGateway {
	@WebSocketServer()
	server: Server;
	constructor(
		private readonly chatService: chatService,
		private readonly prisma: PrismaService
	) {}

	onModuleInit() {
		this.server.on("connection", (socket) => {
		console.log(socket.id);
		console.log("connected");
		});
	}

	@SubscribeMessage("channel")
	async getChannelById(@MessageBody("id") id: number) {
		if (!id) throw Error("id not found");
		console.log("getChannelById ", id);
		const chan = await this.prisma.channel.findUnique({
		where: { chanId: id },
		include: {
			messages: true,
			members: true,
			owner: true,
		},
		});
		if (!chan) return null;
		const messagesList = chan.messages;
		console.log("channel", chan);
		this.server.emit("channel", chan, messagesList);
	}

	@SubscribeMessage("users-not-in-channel")
	async getUsersNotInChannel(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { chanName: string }
	) {
		try {
		const userList = await this.chatService.getUsersNotInChannel(
			data.chanName
		);
		client.emit("users-not-in-channel", userList);
		} catch (error) {
		client.emit("users-not-in-channel-error", error.message);
		}
	}

	@SubscribeMessage("users-in-channel")
	async getUsersNotInChannelExceptUser(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { chanName: string},
		@Request() req: any
	) {
		try {
			const userList = await this.chatService.getUsersInChannelExceptUser(
				data.chanName, req
			);
			client.emit("users-in-channel", userList);
		} catch (error) {
			client.emit("users-in-channel-error", error.message);
		}
	}

	@SubscribeMessage("createChannel")
	async createchan(
		@ConnectedSocket() client: Socket,
		@MessageBody("settings") settings: createChannel,
		@MessageBody() data: { chanName: string; users: User[]; mode: Mode },
		@Request() req: any
	) {
		try {
		const chan = await this.chatService.createChannel(settings, req);
		client.emit("channelCreated", chan);
		const chanlist = await this.prisma.channel.findMany();
		console.log("chan list = ", chanlist);
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
		chanName: string;
		targetId: number;
		},
		@Request() req: any
	) {
		try {
		const result = await this.chatService.inviteUserToChannel(
			data.chanName,
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
			channelData.chanName,
			channelData.targets,
			req
		);
		client.emit("usersAdded", result);
		} catch (error) {
		client.emit("addUsersError", { message: error.message });
		}
	}

	@SubscribeMessage("addOp")
	async addOp(
		client: Socket,
		@MessageBody() data: { chanName: string; username: string },
		@Request() req: any
	) {
		try {
		const result = await this.chatService.addOp(
			data.chanName,
			data.username,
			req
		);
		client.emit("opAdded", result);
		} catch (error) {
		client.emit("addOpError", { message: error.message });
		}
	}

	@SubscribeMessage("renameChan")
	async renameChan(
		client: Socket,
		@MessageBody() data: { chanName: string; newName: string },
		@Request() req: any
	) {
		try {
		const result = await this.chatService.renameChan(
			data.chanName,
			data.newName,
			req
		);
		client.emit("channelRenamed", result);
		} catch {
			console.log('error')
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

	@SubscribeMessage("channel-in-common")
	async getChannelsInCommon(
		@ConnectedSocket() client: Socket,
		@MessageBody("friendId") friendId: number
	): Promise<void>
	{
		const chanlist = await this.chatService.getChannelsInCommon(
		client.handshake.auth.id,
		friendId
		);
		client.emit("channel-in-common", chanlist);
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

	@SubscribeMessage("leaveChan")
	async leaveChan(
		client: Socket,
		@MessageBody() data: { chanName: string },
		@Request() req: any
	) {
		try {
		const result = await this.chatService.leaveChannel(data.chanName, req);
		client.emit("channelLeft", result);
		} catch (error) {
		client.emit("chanLeftError", { message: error.message });
		}
	}

	@SubscribeMessage("banUser")
	async banUser(
		client: Socket,
		@MessageBody() data: { chanName: string; username: string },
		@Request() req: any
	) {
		try {
		const result = await this.chatService.banUser(
			data.chanName,
			data.username,
			req
		);
		client.emit("userBanned", result);
		} catch (error) {
		client.emit("banUserError", { message: error.message });
		}
	}

	@SubscribeMessage("unBanUser")
	async unBanUser(
		client: Socket,
		@MessageBody() data: { chanName: string; username: string },
		@Request() req: any
	) {
		try {
		const result = await this.chatService.unBanUser(
			data.chanName,
			data.username,
			req
		);
		client.emit("userUnBanned", result);
		} catch (error) {
		client.emit("unBanUserError", { message: error.message });
		}
	}

	@SubscribeMessage("kickUser")
	async kickUser(
		client: Socket,
		@MessageBody() data: { chanName: string; username: string },
		@Request() req: any
	) {
		try {
		const result = await this.chatService.kickUser(
			data.chanName,
			data.username,
			req
		);
		client.emit("userKicked", result);
		} catch (error) {
		client.emit("kickUserError", { message: error.message });
		}
	}

	@SubscribeMessage("findAllMembers")
	async findAllMembers(
		client: Socket,
		@MessageBody() data: { chanName: string }
	) {
		try {
		const memberList = await this.chatService.findAllMembers(data.chanName);
		client.emit("allMembers", memberList);
		} catch (error) {
		client.emit("findAllMembersError", { message: error.message });
		}
	}

	@SubscribeMessage("findAllUsers")
	async findAllUsers(
		client: Socket,
		@MessageBody() data: { chanName: string }
	) {
		try {
		const UserList = await this.prisma.user.findMany();
		client.emit("allUsers", UserList);
		} catch (error) {
		client.emit("findAllUsersError", { message: error.message });
		}
	}

	@SubscribeMessage("findAllBannedMembers")
	async findAllBannedMembers(
		client: Socket,
		@MessageBody() data: { chanName: string }
	) {
		try {
		const bannedList = await this.chatService.findAllBannedMembers(
			data.chanName
		);
		client.emit("allMembers", bannedList);
		} catch (error) {
		client.emit("findAllMembersError", { message: error.message });
		}
	}

	@SubscribeMessage("recapMessages")
	async findAllChanMessages(
		client: Socket,
		@MessageBody() data: { chanName: string }
	) {
		try {
		console.log("chan name is", data.chanName);
		const messagesList = await this.chatService.findAllChanMessages(data.chanName)
		client.emit("findAllMessage", messagesList);
		console.log("msglist", messagesList);
		} catch (error) {
		// client.emit("findAllMessageError",  error.message );
		}
	}
	@SubscribeMessage("create-message")
	async createMessage(
		@ConnectedSocket() client: Socket,
		@MessageBody() createMessageDto: CreateMessageDto,
		@Request() req: any
	) {
		console.log(createMessageDto);
		try {
		const message = await this.chatService.createMessage(
			createMessageDto,
			req
		);

		console.log(message);

		this.server.emit("recapMessages", message);
		} catch (error) {
		client.emit("createMsgError", { message: error.message });
		}
	}

		@SubscribeMessage("updateMessage")
		async updateMessage(
		client: Socket,
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
		client: Socket,
		@MessageBody() data: { chanName: string; msgId: number },
		@Request() req: any
		) {
		try {
			await this.chatService.removeMessages(
			data.chanName,
			data.msgId,
			req
			);
			client.emit("allMembers", { message: "Message removed" });
		} catch (error) {
			client.emit("findAllMembersError", { message: error.message });
		}
		}

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
