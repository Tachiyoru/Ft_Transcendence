import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AchievementCreateImput } from "./dto/create-achievements.dto";
import { User } from "@prisma/client";
import { NotificationService } from "src/notification/notification.service";
import { NotificationType } from "src/notification/content-notification";
import { CreateNotificationDto } from "src/notification/dto/create-notification.dto";

@Injectable()
export class AchievementsService
{
	constructor(
		private prismaService: PrismaService,
		private notificationService: NotificationService
	) {}

	async onModuleInit()
	{
		await this.createInitialAchievements({
			title: "1",
			description: "Link your profile to 42 or Github",
			icon: "src/achievements-1.png",
		});
		await this.createInitialAchievements({
			title: "2",
			description: "10 times winner",
			icon: "src/achievements-2.png",
		});
		await this.createInitialAchievements({
			title: "3",
			description: "Top 3 worldwide",
			icon: "src/achievements-3.png",
		});
		await this.createInitialAchievements({
			title: "4",
			description: "Take revenge",
			icon: "src/achievements-4.png",
		});
		await this.createInitialAchievements({
			title: "5",
			description: "First game",
			icon: "src/achievements-5.png",
		});
		await this.createInitialAchievements({
			title: "6",
			description: "Changed your avatar/username",
			icon: "src/achievements-6.png",
		});
		
		await this.createInitialAchievements({
			title: "7",
			description: "Did 42 games",
			icon: "src/achievements-7.png",
		});
		await this.createInitialAchievements({
			title: "8",
			description: "Serial looser : lose 10 times in a row",
			icon: "src/achievements-8.png",
		});
		const achievements = await this.prismaService.achievement.findMany({});
	}


	async createInitialAchievements(achievementInput: AchievementCreateImput)
	{
		const achievement = await this.prismaService.achievement.findUnique({
			where: {
				title: achievementInput.title,
			},
		});
		if (!achievement)
		{
			await this.prismaService.achievement.create({
				data: {
					title: achievementInput.title,
					description: achievementInput.description,
					icon: achievementInput.icon,
				},
			});
		}

	}

	async getAchievementsList()
	{		const achievementsList = await this.prismaService.achievement.findMany();
		return achievementsList;
	}

	async getMyAchievements(user: User)
	{
		const me = await this.prismaService.user.findUnique({
			where: { id: user.id },
			include: { achievements: true },
		});

		if (!me) throw new Error("User not found");

		return me.achievements;
	}

	async getAchievementsByUserId(userId: number)
	{
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

	async addAchievementByUserId(userId: number, achievementId: number)
	{
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
			(achievement) => achievement.id === achievementId
		);
		if (achievementAlreadyExists) return user;
		const updatedUser = await this.prismaService.user.update({
			where: {
				id: userId,
			},
			data: {
				achievements: {
					connect: {
						id: achievementId,
					},
				},
			},
		});

		const notificationDto = new CreateNotificationDto();
		notificationDto.achievementName = achievement.title;

		await this.notificationService.addNotificationByUserId(
			userId,
			notificationDto,
			NotificationType.ACHIEVEMENT_UNLOCKED
		);

		return updatedUser;
	}

	async setTittle(userId: number, achievementId: number){
		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				achievements: true,
			},
		});
		const achievement = await this.prismaService.achievement.findUnique({
			where: {
				id: achievementId,
			},
		});
		if (!achievement) throw new Error("Achievement not found");
		const updatedUser = await this.prismaService.user.update({
			where: {
				id: userId,
			},
			data: {
				tittle: (achievement.title),
			},
		});
	}

}
