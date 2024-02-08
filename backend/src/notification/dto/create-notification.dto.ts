import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto
{
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	fromUser: string;

	@IsOptional()
	fromUserId: number;

	@IsOptional()
	@IsString()
	achievementName: string;

	@IsOptional()
	@IsString()
	channelName: string;

	@IsOptional()
	@IsString()
	privilegeName: string;
}
