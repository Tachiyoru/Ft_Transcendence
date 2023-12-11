import { Module } from "@nestjs/common";
import { chatService } from "./chat.service";
import { chatGateway } from "./chat.gateway";
import { JwtService } from "@nestjs/jwt";

@Module({
  providers: [chatGateway, chatService, JwtService],
})
export class chatModule {}
