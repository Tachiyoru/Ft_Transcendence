import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { chatModule } from "./chat/chat.module";
import { JwtService } from "@nestjs/jwt";
import { FriendsListModule } from "./friends-list/friends-list.module";
import { NotificationModule } from "./notification/notification.module";
import { AchievementsModule } from "./achievements/achievements.module";
import { StatsModule } from "./stats/stats.module";
import { SocketModule } from "./socket/socket.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AchievementsModule,
    AuthModule,
    StatsModule,
    FriendsListModule,
    NotificationModule,
    PrismaModule,
    chatModule,
	SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
