import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { chatModule } from './chat/chat.module';
import { JwtService } from "@nestjs/jwt";
import { FriendsListModule } from "./friends-list/friends-list/friends-list.module";
import { AchievementsModule } from "./achievements/achievements.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		UserModule,
		AchievementsModule,
		AuthModule,
		FriendsListModule,
		PrismaModule,
		chatModule,
	],
	controllers: [AppController],
	providers: [AppService, JwtService],
})
export class AppModule {}