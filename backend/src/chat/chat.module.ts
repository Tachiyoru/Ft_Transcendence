import { Module } from "@nestjs/common";
import { chatService } from "./chat.service";
import { chatGateway } from "./chat.gateway";
import { JwtService } from "@nestjs/jwt";
import { NotificationService } from "src/notification/notification.service";
import { NotificationGateway } from "src/notification/notification.gateway";

@Module({
	providers: [NotificationGateway, chatGateway, chatService, JwtService, NotificationService],
})
export class chatModule {}
