import { Module } from "@nestjs/common";
import { FriendsListController } from "./friends-list.controller";
import { FriendsListService } from "./friends-list.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
	controllers: [FriendsListController],
	providers: [FriendsListService, JwtService, PrismaService],
})
export class FriendsListModule {}
