import { Achievement, User } from '.prisma/client';
import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { TokenGuardTwo } from '../auth/guard/token-2.guard';
import { AchievementsService } from './achievements.service';

@Controller('achievements')
@UseGuards(TokenGuardTwo)
export class AchievementsController
{
	constructor(private achievementsService: AchievementsService) {}

	@Get("list")
	async getAchievementsList(): Promise<Achievement[]>
	{
		console.log("getAchievementsList");
		return (this.achievementsService.getAchievementsList());
	}

	@Get("/:id")
	async getAchievementsByUserId(@Param('id', ParseIntPipe) userId: number): Promise<Achievement[]>
	{
		return (this.achievementsService.getAchievementsByUserId(userId));
	}

	@Post("/add/:userId/:achievementId")
	async addAchievementToUser(@Param('userId', ParseIntPipe) userId: number, @Param('achievementId', ParseIntPipe) achievementId: number): Promise<User>
	{
		return (this.achievementsService.addAchievementToUser(userId, achievementId));
	}
}