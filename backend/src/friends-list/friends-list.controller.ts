import
{
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	UseGuards,
} from "@nestjs/common";
import { FriendsListService } from "./friends-list.service";
import { GetUser } from "src/auth/decorator";
import { User } from "@prisma/client";
import { TokenGuard } from "src/auth/guard";

@Controller("friends-list")
@UseGuards(TokenGuard)
export class FriendsListController
{
	constructor(private friendListService: FriendsListService) {}

	@Get("mine")
	async getMyFriends(@GetUser() user: User): Promise<User[]>
	{
		return this.friendListService.getMyFriends(user);
	}

	@Get('pending-request')
	async getUsersWithMeInPendingList(@GetUser() user: User)
	{
		const users = await this.friendListService.getUsersWithMeInPendingList(user);
		return users;
	}

	@Get("non-friends")
	async getNonFriends(@GetUser() user: User): Promise<User[]>
	{
		return (this.friendListService.getNonFriends(user));
	}

	@Get('/pending-list')
	async pendingList(@GetUser() user: User)
	{
		return this.friendListService.pendingList(user.id);
	}

	@Delete('/pending-list/reject/:id')
	rejectPending(@GetUser() user: User, @Param('id') id: string)
	{
		return this.friendListService.rejectPending(user, +id);
	}

	@Get('in-common/:friendId')
	async getFriendsInCommon(
		@GetUser() user: User, @Param('friendId', ParseIntPipe) friendId: number)
	{
		return this.friendListService.getFriendsInCommon(user.id, friendId);
	}

	@Post('/friend-request/accept/:id')
	acceptRequest(@GetUser() user: User, @Param('id') id: string)
	{
		return this.friendListService.acceptRequest(user, +id);
	}

	@Delete('/friend-request/reject/:id')
	rejectRequest(@GetUser() user: User, @Param('id') id: string)
	{
		return this.friendListService.rejectRequest(user, +id);
	}

	@Post('/friend-request/:friendId')
	friendRequest(@GetUser() user: User, @Param('friendId', ParseIntPipe) friendId: number): Promise<User>
	{
		return this.friendListService.friendRequest(user, friendId);
	}

	@Get("from/:id")
	async getFriendsFrom(@Param("id", ParseIntPipe) id: number): Promise<User[]> {
		return this.friendListService.getFriendsFrom(id);
	}

	@Delete("remove/:friendId")
	removeFriend(
		@GetUser() user: User,
		@Param("friendId", ParseIntPipe) friendId: number
	): Promise<User> {
		return this.friendListService.removeFriend(user, friendId);
	}

	@Get('/blocked-users')
	getBlockedUsers(@GetUser() user: User): Promise<User[]> {
		return (this.friendListService.getBlockedUsers(user));
	}

	@Get('/blocked-users/:userId')
    async checkIfUserIsBlocked(@Param('userId', ParseIntPipe) userId: number, @GetUser() user: User): Promise<{isBlocked: boolean}> {
        const isBlocked = await this.friendListService.isUserBlockedById(userId, user);
		console.log(isBlocked)
		return { isBlocked };
    }

	@Post('block/:userId')
	blockUser(@GetUser() user: User, @Param('userId', ParseIntPipe) userId: number): Promise<User>
	{
		return (this.friendListService.blockUser(user, userId));
	}

	@Post('unblock/:userId')
	async(@GetUser() user: User, @Param('userId', ParseIntPipe) userId: number): Promise<User>
	{
		return (this.friendListService.unblockUser(user, userId));
	}
}
