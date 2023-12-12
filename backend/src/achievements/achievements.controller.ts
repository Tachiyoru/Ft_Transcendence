import { Achievement, User } from '.prisma/client';
import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { TokenGuard } from 'src/auth/guard';

@Controller('achievements')
@UseGuards(TokenGuard)
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