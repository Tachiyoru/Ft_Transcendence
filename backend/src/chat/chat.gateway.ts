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
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

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
    @MessageBody() data: { chanName: string; users: User[] },
    @Request() req: any
  ) {
    const { chanName, users } = data;
    const chan = await this.chatService.createChannel(chanName, users, req);
    client.emit("channelCreated", chan);
    client.join(chanName);
  }
  @SubscribeMessage("joinChan")
  @SubscribeMessage("leaveChan")
  @SubscribeMessage("banUser")
  @SubscribeMessage("kickUser")
  @SubscribeMessage("findAllChannels")
  //   async findAllChannels(): Promise<[]> {
  //     return this.chatService.findAllChans();
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

  //   @SubscribeMessage('updateMessage')
  //   update(@MessageBody() updateMessageDto: UpdateMessageDto) {
  //     return this.chatService.update(updateMessageDto.id, updateMessageDto);
  //   }

  //   @SubscribeMessage('removeMessage')
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
