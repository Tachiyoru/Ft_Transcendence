import { Module } from "@nestjs/common";
import { chatService } from "./chat.service";
import { chatGateway } from "./chat.gateway";

@Module({
  providers: [chatGateway, chatService],
})
export class chatModule {}
