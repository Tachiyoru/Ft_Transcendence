import { Injectable, Request } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Channel, User } from "@prisma/client";
import { Socket } from "socket.io";
import { ChannelCreateInput } from "./creat.input";

@Injectable()
export class chatService {
  constructor(private readonly prisma: PrismaService) {}

  //   dans le front on envoie le nom du chan et le nom des users qui sont dedans
  //   const createChannel = (channelName) => {
  // 	// Appeler le serveur pour créer un nouveau canal
  // 	socket.emit('createChannel', { channelName });
  //   };
  private async createChan(chaninput: ChannelCreateInput) {
    const chan = await this.prisma.channel.findFirst();
    if (!chan) {
      await this.prisma.channel.create({
        data: {
          name: chaninput.name,
          owner: chaninput.owner,
        },
      });
    }
  }

  async createChannel(
    channelName: string,
		users: User[],
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
      data: { name: channelName, owner: req.user.username },
      // voir si on peut deja la ajouter les users dans le chan via la variables members:User[]
    });
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
