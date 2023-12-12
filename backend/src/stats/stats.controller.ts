import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Stats, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { TokenGuardTwo } from 'src/auth/guard/token-2.guard';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(TokenGuardTwo)
export class StatsController
{
	constructor(private statsService: StatsService) {}

	@Get('mine')
	async getMyStats(@GetUser() user: User): Promise<Stats[]>
	{
		return (this.statsService.getMyStats(user));
	}

	@Get(':id')
	async getStatsById(@Param('id', ParseIntPipe) userId: number): Promise<Stats[]>
	{
		return (this.statsService.getStatsById(userId));
	}
}