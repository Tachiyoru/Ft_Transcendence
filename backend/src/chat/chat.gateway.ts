import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { chatService } from "./chat.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { Server, Socket } from "socket.io";
import { Request } from "@nestjs/common";
import { Channel, Mode, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { channel } from "diagnostics_channel";

@WebSocketGateway({})
export class chatGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly chatService: chatService,
    private readonly prisma: PrismaService
  ) {}

  @SubscribeMessage("createChannel")
  async createchan(
    client: Socket,
    @MessageBody() data: { chanName: string; users: User[]; mode: Mode },
    @Request() req: any
  ) {
    const { chanName, users, mode } = data;
    try {
      const chan = await this.chatService.createChannel(
        chanName,
        users,
        mode,
        req
      );
      client.emit("channelCreated", chan);
      client.join(chanName);
    } catch (error) {
      client.emit("channelCreateError", { error: "Could not create channel" });
    }
  }

  @SubscribeMessage("addOp")
  async handleAddOp(
    client: Socket,
    @MessageBody() data: { chanName: string; username: string },
    @Request() req: any
  ) {
    try {
      const owner = await channel
        .caller(
          this.prisma.channel.findUnique({ where: { name: data.chanName } })
        )
        .owner();
      const result = await this.chatService.addOp(
        data.chanName,
        data.username,
        owner,
        req
      );
      client.emit("opAdded", result);
    } catch (error) {
      client.emit("addOpError", { message: error.message });
    }
  }

  @SubscribeMessage("renameChan")
  async handleRenameChan(
    client: Socket,
    @MessageBody() data: { chanName: string; newName: string },
    @Request() req: any
  ) {
    try {
      const owner = await channel
        .caller(
          this.prisma.channel.findUnique({ where: { name: data.chanName } })
        )
        .owner();
      const result = await this.chatService.renameChan(
        data.chanName,
        data.newName,
        owner,
        req
      );
      client.emit("channelRenamed", result);
    } catch (error) {
      client.emit("renameChanError", { message: error.message });
    }
  }

  @SubscribeMessage("findAllChannels")
  async findAllChannels(): Promise<Channel[]> {
    const chanlist = await this.prisma.channel.findMany();
    return chanlist;
  }

  @SubscribeMessage("joinChan")
  async joinChan(
    client: Socket,
    @MessageBody() data: { chanName: string },
    @Request() req: any
  ) {
    try {
      const banlist: User[] = await channel
        .caller(
          this.prisma.channel.findUnique({ where: { name: data.chanName } })
        )
        .banned();
      const result = await this.chatService.joinChannel(
        data.chanName,
        banlist,
        req
      );
      client.emit("channelJoined", result);
    } catch (error) {
      client.emit("renameChanError", { message: error.message });
    }
  }

  @SubscribeMessage("leaveChan")
  async leaveChan(
    client: Socket,
    @MessageBody() data: { chanName: string },
    @Request() req: any
  ) {
    try {
      const owner = await channel
        .caller(
          this.prisma.channel.findUnique({ where: { name: data.chanName } })
        )
        .owner();
      const result = await this.chatService.leaveChannel(
        data.chanName,
        owner,
        req
      );
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
      const owner = await channel
.caller(
          this.prisma.channel.findUnique({ where: { name: data.chanName } }))
        .owner();
      const banlist = await channel.caller(
          this.prisma.channel.findUnique({ where: { name: data.chanName } })
        )
        .banned();
      const result = await this.chatService.banUser(
        data.chanName,
        data.username,
        banlist,
        owner,
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
		const owner = await channel
  .caller(
			this.prisma.channel.findUnique({ where: { name: data.chanName } }))
		  .owner();
		const banlist = await channel.caller(
			this.prisma.channel.findUnique({ where: { name: data.chanName } }))
		  .banned();
		const result = await this.chatService.unBanUser(
		  data.chanName,
		  data.username,
		  banlist,
		  owner,
		  req
		);
		client.emit("userUnBanned", result);
	  } catch (error) {
		client.emit("unBanUserError", { message: error.message });
	  }
  }

  @SubscribeMessage("kickUser")
//   async kickUser(
// 	client: Socket,
// 	@MessageBody() data: { chanName: string; username: string },
// 	@Request() req: any
//   ) {
// 	try {
// 	  const owner = await channel
// 		.caller(
// 		  this.prisma.channel.findUnique({ where: { name: data.chanName } })
// 		)
// 		.owner();
// 	  const result = await this.chatService.kickUser(
// 		data.chanName,
// 		data.username,
// 		owner,
// 		req
// 	  );
// 	  client.emit("userKicked", result);
// 	} catch (error) {
// 	  client.emit("kickUserError", { message: error.message });
// 	}
//   }
  
  @SubscribeMessage("findAllMembers")
  //   async findAllMembers(
  //     @MessageBody("chanName") chanName: string
  //   ): Promise<User[]> {
  //     return this.chatService.findAllMembers(chanName);
  //   }
  @SubscribeMessage("findAllBannedMembers")
  //   async findAllBannedMembers(
  //     @MessageBody("chanName") chanName: string
  //   ): Promise<User[]> {
  //     return this.chatService.findAllBannedMembers(chanName);
  //   }
  @SubscribeMessage("findAllMessages")
  //   async findAllMessages(
  //     @MessageBody("chanName") chanName: string
  //   ): Promise<any> {
  //     return this.chatService.findAllMessages(chanName);
  //   }
  @SubscribeMessage("createMessage")
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    // const message = await this.chatService.create(
    //   createMessageDto,
    //   client.id
    // );
    // this.server.emit("newMessage", message);
    // return message;
  }

  @SubscribeMessage("updateMessage")
  //   update(@MessageBody() updateMessageDto: UpdateMessageDto) {
  //     return this.chatService.update(updateMessageDto.id, updateMessageDto);
  //   }
  @SubscribeMessage("removeMessage")
  //   remove(@MessageBody() id: number) {
  //     return this.chatService.remove(id);
  //   }
  @SubscribeMessage("typing")
  async typing(
    @MessageBody("isTyping") isTyping: boolean,
    @ConnectedSocket() client: Socket
  ) {
    // const name = await this.chatService.getClientName(client.id);
    client.broadcast.emit("typing", { name, isTyping });
  }
}
