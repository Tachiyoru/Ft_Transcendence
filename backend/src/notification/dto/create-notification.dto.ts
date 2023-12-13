import { IsString } from "class-validator";

export class CreateNotificationDto
{
	@IsString()
	type: string;

	@IsString()
	content: string;
}
