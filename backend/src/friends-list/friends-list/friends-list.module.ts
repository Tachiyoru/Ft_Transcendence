import { Module } from "@nestjs/common";
import { FriendsListController } from "./friends-list.controller";
import { FriendsListService } from "./friends-list.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { NotificationService } from "src/notification/notification.service";

@Module({
  controllers: [FriendsListController],
  providers: [
    FriendsListService,
    JwtService,
    PrismaService,
    NotificationService,
  ],
})
export class FriendsListModule {}
