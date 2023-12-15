import { Module } from "@nestjs/common";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [StatsController],
  providers: [StatsService, JwtService],
})
export class StatsModule {}
