import { Achievement, User } from ".prisma/client";
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AchievementsService } from "./achievements.service";
import { TokenGuard } from "src/auth/guard";
import { GetUser } from "src/auth/decorator";

@Controller("achievements")
@UseGuards(TokenGuard)
export class AchievementsController {
  constructor(private achievementsService: AchievementsService) {}

  @Get("list")
  async getAchievementsList(): Promise<Achievement[]> {
    return this.achievementsService.getAchievementsList();
  }

  @Get("/mine")
  async getMyAchievements(@GetUser() user: User): Promise<Achievement[]> {
    return this.achievementsService.getMyAchievements(user);
  }

	@Get("/locked")
	async getLockedAchievements(@GetUser() user: User): Promise<Achievement[]>
	{
		return this.achievementsService.getLockedAchievements(user);
	}
	
  @Get("/:id")
  async getAchievementsByUserId(
    @Param("id", ParseIntPipe) userId: number
  ): Promise<Achievement[]> {
    return this.achievementsService.getAchievementsByUserId(userId);
  }

  @Post("/add/:id")
  async addAchievementByUserId(
    @GetUser() user: User,
    @Param("id", ParseIntPipe) id: number
  ): Promise<User> {
    return await this.achievementsService.addAchievementByUserId(user.id, id);
  }
}
