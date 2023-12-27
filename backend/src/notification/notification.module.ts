import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { JwtService } from "@nestjs/jwt";
import { NotificationGateway } from "./notification.gateway";

@Module({
	controllers: [NotificationController],
	providers: [NotificationGateway, NotificationService, JwtService],
})
export class NotificationModule {}
