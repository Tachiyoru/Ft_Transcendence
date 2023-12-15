import { Module } from "@nestjs/common";
import { AchievementsController } from "./achievements.controller";
import { AchievementsService } from "./achievements.service";
import { JwtService } from "@nestjs/jwt";
import { NotificationService } from "src/notification/notification.service";

@Module({
  controllers: [AchievementsController],
  providers: [AchievementsService, JwtService, NotificationService],
})
export class AchievementsModule {}
