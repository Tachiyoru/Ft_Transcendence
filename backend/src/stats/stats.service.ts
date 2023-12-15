import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class StatsService {
  constructor(private prismaService: PrismaService) {}

  async getMyStats(user: User) {
    const me = await this.prismaService.user.findUnique({
      where: { id: user.id },
      include: { stats: true },
    });
    if (!me) throw new Error("User not found");
    return me.stats;
  }

  async getStatsById(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { stats: true },
    });
    if (!user) throw new Error("User not found");
    return user.stats;
  }
}
