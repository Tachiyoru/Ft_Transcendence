import { User } from "@prisma/client"

export class addUserToChannelDto
{
	chanId: number
	targets: User[]
}