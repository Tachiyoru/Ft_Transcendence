import { User } from "@prisma/client"

export class addUserToChannelDto
{
	chanName: string
	targets: User[]
}