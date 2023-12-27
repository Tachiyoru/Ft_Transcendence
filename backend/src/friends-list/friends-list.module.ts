import { Module } from "@nestjs/common";
import { FriendsListController } from "./friends-list.controller";
import { FriendsListService } from "./friends-list.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { NotificationService } from "src/notification/notification.service";
import { NotificationGateway } from "src/notification/notification.gateway";

@Module({
	controllers: [FriendsListController],
	providers: [
		FriendsListService,
		JwtService,
		PrismaService,
		NotificationService,
		NotificationGateway
	],
})
export class FriendsListModule {}
