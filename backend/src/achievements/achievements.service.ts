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
			description: "Complete your first quest",
			icon: "https://imgs.search.brave.com/VaaA6X7NDX-e4PTyoa84OmkA-1rZ2EcwR6i1e-8REiM/rs:fit:860:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9j/L2NiL0NpcmNsZS1p/Y29ucy10cm9waHku/c3Zn.svg",
		});
		await this.createInitialAchievements({
			title: "Quests addict",
			description: "Complete 10 quests",
			icon: "https://imgs.search.brave.com/VaaA6X7NDX-e4PTyoa84OmkA-1rZ2EcwR6i1e-8REiM/rs:fit:860:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9j/L2NiL0NpcmNsZS1p/Y29ucy10cm9waHku/c3Zn.svg",
		});
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
	{
		const achievementsList = await this.prismaService.achievement.findMany();
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
}
