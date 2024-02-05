import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AchievementCreateImput } from "./dto/create-achievements.dto";
import { Achievement, User } from "@prisma/client";
import { NotificationService } from "src/notification/notification.service";
import { NotificationType } from "src/notification/content-notification";
import { CreateNotificationDto } from "src/notification/dto/create-notification.dto";

@Injectable()
export class AchievementsService {
  constructor(
    private prismaService: PrismaService,
    private notificationService: NotificationService
  ) {}

  async onModuleInit() {
    await this.createInitialAchievements({
      idType: 1,
      description: "Link your profile to 42 or Github",
      icon: "src/achievements-1.png",
    });
    await this.createInitialAchievements({
      idType: 2,
      description: "10 times winner",
      icon: "src/achievements-2.png",
    });
    await this.createInitialAchievements({
      idType: 3,
      description: "Top 3 worldwide",
      icon: "src/achievements-3.png",
    });
    await this.createInitialAchievements({
      idType: 4,
      description: "Take revenge",
      icon: "src/achievements-4.png",
    });
    await this.createInitialAchievements({
      idType: 5,
      description: "First game",
      icon: "src/achievements-5.png",
    });
    await this.createInitialAchievements({
      idType: 6,
      description: "Changed your avatar/username",
      icon: "src/achievements-6.png",
    });
    await this.createInitialAchievements({
      idType: 7,
      description: "Did 42 games",
      icon: "src/achievements-7.png",
    });
    await this.createInitialAchievements({
      idType: 8,
      description: "Serial looser : lose 10 times in a row",
      icon: "src/achievements-8.png",
    });
  }

  async createInitialAchievements(achievementInput: AchievementCreateImput) {
    // const achievement = await this.prismaService.achievement.findUnique({
    // 	where: {
    // 		id: achievementInput.idType,
    // 	},
    // });
    // if (!achievement)
    // {
    const achiev = await this.prismaService.achievement.create({
      data: {
        idType: achievementInput.idType,
        description: achievementInput.description,
        icon: achievementInput.icon,
      },
    });
    return achiev;
    // }
  }

  async getAchievementsList() {
    const achievementsList = await this.prismaService.achievement.findMany();
    return achievementsList;
  }

  async getMyAchievements(user: User) {
    const me = await this.prismaService.user.findUnique({
      where: { id: user.id },
      include: { achievements: true },
    });

    if (!me) throw new Error("User not found");

    return me.achievements;
  }

  async getAchievementsByUserId(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        achievements: true,
      },
    });
    if (!user) throw new Error("User not found");
    return user.achievements;
  }

  async addAchievementByUserId(userId: number, achievementId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        achievements: true,
      },
    });
    if (!user) throw new Error("User not found");
    const achievement = await this.prismaService.achievement.findUnique({
      where: {
        id: achievementId,
      },
    });
    if (!achievement) throw new Error("Achievement not found");
    const userAchievements = user.achievements;
    const achievementAlreadyExists = userAchievements.find(
      (achievement) => achievement.idType === achievementId
    );
    if (achievementAlreadyExists) return user;
    let newAchiev: Achievement | undefined;
    newAchiev = await this.prismaService.achievement.create({
      data: {
        idType: achievement.idType,
        description: achievement.description,
        icon: achievement.icon,
      },
    });
    if (!newAchiev) throw new Error("Achievement not found");
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        achievements: {
          connect: {
            id: newAchiev.id,
          },
        },
      },
    });

    const notificationDto = new CreateNotificationDto();
    notificationDto.achievementName = achievement.description;

    await this.notificationService.addNotificationByUserId(
      userId,
      notificationDto,
      NotificationType.ACHIEVEMENT_UNLOCKED
    );

    return updatedUser;
  }

  // async setTittle(userId: number, achievementId: number){
  // 	const user = await this.prismaService.user.findUnique({
  // 		where: {
  // 			id: userId,
  // 		},
  // 		include: {
  // 			achievements: true,
  // 		},
  // 	});
  // 	const achievement = await this.prismaService.achievement.findUnique({
  // 		where: {
  // 			id: achievementId,
  // 		},
  // 	});
  // 	if (!achievement) throw new Error("Achievement not found");
  // 	const updatedUser = await this.prismaService.user.update({
  // 		where: {
  // 			id: userId,
  // 		},
  // 		data: {
  // 			tittle: (achievement.idType),
  // 		},
  // 	});
  // }
}
