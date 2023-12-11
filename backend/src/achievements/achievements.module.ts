import { Module } from '@nestjs/common';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	controllers: [AchievementsController],
	providers: [AchievementsService, JwtService]
})
export class AchievementsModule {}
