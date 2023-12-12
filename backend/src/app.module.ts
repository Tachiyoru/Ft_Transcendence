import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { JwtService } from "@nestjs/jwt";
import { FriendsListModule } from "./friends-list/friends-list/friends-list.module";
import { AchievementsModule } from "./achievements/achievements.module";
import { StatsModule } from "./stats/stats.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MulterModule.register({
			dest: "./uploads",
		}),
		UserModule,
		AchievementsModule,
		AuthModule,
		FriendsListModule,
		StatsModule,
		PrismaModule,
	],
	controllers: [AppController],
	providers: [AppService, JwtService],
})
export class AppModule {}