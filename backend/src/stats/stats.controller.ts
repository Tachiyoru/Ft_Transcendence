import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { Stats, User } from "@prisma/client";
import { GetUser } from "src/auth/decorator";
import { StatsService } from "./stats.service";
import { TokenGuard } from "src/auth/guard";

@Controller("stats")
@UseGuards(TokenGuard)
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get("mine")
  async getMyStats(@GetUser() user: User): Promise<Stats | null> {
    return this.statsService.getMyStats(user);
  }

  @Get(":userId")
  async getStatsById(
    @Param("userId") userId: string
  ): Promise<Stats | null> {
    return this.statsService.getStatsById(userId);
  }
}
