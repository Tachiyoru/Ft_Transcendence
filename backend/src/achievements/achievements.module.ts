import { Module } from "@nestjs/common";
import { AchievementsController } from "./achievements.controller";
import { AchievementsService } from "./achievements.service";
import { JwtService } from "@nestjs/jwt";
import { NotificationService } from "src/notification/notification.service";
import { NotificationGateway } from "src/notification/notification.gateway";

@Module({
	controllers: [AchievementsController],
	providers: [NotificationGateway, AchievementsService, JwtService, NotificationService],
})
export class AchievementsModule {}
