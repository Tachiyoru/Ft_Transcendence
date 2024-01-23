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
			title: "First steps",
			description: "it's just the beginning on this wonderfull SPA",
			icon: "src/achievements-1.png",
		});
		await this.createInitialAchievements({
			title: "Top of the world",
			description: "You are in the top 3",
			icon: "src/achievements-3.png",
		});
		await this.createInitialAchievements({
			title: "Polymorph",
			description: "Changed your avatar",
			icon: "src/achievements-7.png",
		});
		await this.createInitialAchievements({
			title: "I go by many names",
			description: "Change your username",
			icon: "src/achievements-7.png",
		});
		await this.createInitialAchievements({
			title: "Gladiator",
			description: "Are you not entertained ? You just won 10 games",
			icon: "src/achievements-2.png",
		});
		await this.createInitialAchievements({
			title: "Serial loser",
			description: "You have lost 10 games without losing interest here's your reward",
			icon: "src/achievements-8.png",
		});
		await this.createInitialAchievements({
			title: "The one who code",
			description: "You are from 42 I see",
			icon: "src/achievements-6.png",
		});
		await this.createInitialAchievements({
			title: "the one who github",
			description: "You have a github account only to learn or store your code I suppose ;)",
			icon: "src/achievements-6.png",
		});
		await this.createInitialAchievements({
			title: "Google is my friend",
			description: "You used google to verify your email, you are someone I can trust",
			icon: "src/achievements-4.png",
		});
		const achievements = await this.prismaService.achievement.findMany({});
		console.log(achievements);
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
