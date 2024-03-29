import { Injectable, Req } from "@nestjs/common";
import { User } from "@prisma/client";
import { NotificationType } from "src/notification/content-notification";
import { CreateNotificationDto } from "src/notification/dto/create-notification.dto";
import { NotificationService } from "src/notification/notification.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FriendsListService {
  constructor(
    private prismaService: PrismaService,
    private notificationService: NotificationService
  ) {}

  async pendingList(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { pendingList: true },
    });
    if (!user) throw new Error("User not found");
    return user.pendingList;
  }

  async myPendingList(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { pendingFrom: true },
    });
    if (!user) throw new Error("User not found");
    return user.pendingFrom;
  }

  async rejectPending(user: User, friendId: number, notificationId?: number) {
    user = await this.prismaService.user.update({
      where: { id: friendId },
      include: { pendingList: true },
      data: {
        pendingList: { disconnect: { id: user.id } },
      },
    });
    return user;
  }

  async getUsersWithMeInPendingList(user: User) {
    const users = await this.prismaService.user.findMany({
      where: {
        pendingList: {
          some: {
            id: user.id,
          },
        },
      },
    });

    return users;
  }

  async acceptRequest(user: User, friendId: number) {
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { pendingList: { disconnect: { id: friendId } } },
    });
    await this.prismaService.user.update({
      where: { id: user.id },
      include: { friends: true },
      data: { friends: { connect: { id: friendId } } },
    });
    await this.prismaService.user.update({
      where: { id: friendId },
      include: { friends: true },
      data: {
        friends: { connect: { id: user.id } },
      },
    });

    const notificationDto = new CreateNotificationDto();
    if (user.username) notificationDto.fromUser = user.username;

    await this.notificationService.addNotificationByUserId(
      friendId,
      notificationDto,
      NotificationType.FRIENDREQUEST_ACCEPTED
    );

    return user;
  }

  async rejectRequest(user: User, friendId: number, notificationId?: number) {
    user = await this.prismaService.user.update({
      where: { id: user.id },
      include: { pendingList: true },
      data: {
        pendingList: { disconnect: { id: friendId } },
      },
    });
    if (notificationId) {
      const updatedUser = await this.prismaService.user.findUnique({
        where: { id: user.id },
        include: { notifications: true },
      });
      if (updatedUser) return updatedUser;
    }

    return user;
  }

  async friendRequest(user: User, friendId: number) {
    const friend = await this.prismaService.user.findUnique({
      where: { id: friendId },
      include: { pendingList: true },
    });
    if (!friend) throw new Error("Friend not found.");
    const uuser = await this.prismaService.user.update({
      where: { id: friendId },
      include: { pendingList: true },
      data: { pendingList: { connect: { id: user.id } } },
    });
    const test = await this.prismaService.user.findUnique({
      where: { id: user.id },
      include: { pendingFrom: true },
    });

    const notificationDto = new CreateNotificationDto();
    if (user.username) notificationDto.fromUser = user.username;

    await this.notificationService.addNotificationByUserId(
      friendId,
      notificationDto,
      NotificationType.FRIENDREQUEST_RECEIVED
    );

    return user;
  }

  async removeFriend(user: User, friendId: number) {
    const friend = await this.prismaService.user.findUnique({
      where: {
        id: friendId,
      },
      include: {
        friends: true,
      },
    });

    if (!user || !friend) throw new Error("User not found");

    user = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        friends: {
          disconnect: { id: friendId },
        },
      },
      include: { friends: true },
    });

    await this.prismaService.user.update({
      where: { id: friendId },
      data: {
        friends: {
          disconnect: { id: user.id },
        },
      },
      include: { friends: true },
    });

    return user;
  }

  async blockUser(user: User, blockedUserId: number) {
    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      include: { blockedList: true, friends: true },
      data: {
        blockedList: {
          connect: { id: blockedUserId },
        },
      },
    });
    if (!updatedUser) throw new Error("User not found");
    if (updatedUser.friends.length > 0) {
      const a = updatedUser.friends.map((friend) => friend.id);
      const b = updatedUser.blockedList.map((blocked) => blocked.id);
      const common = a.filter((id) => b.includes(id));
      if (common.length > 0) {
		await this.removeFriend(user, common[0]);
      }
    }
    return updatedUser;
  }

  async unblockUser(user: User, unblockedUserId: number) {
    user = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        blockedList: {
          disconnect: { id: unblockedUserId },
        },
      },
    });
    return user;
  }

  async getBlockedUsers(user: User) {
    const me = await this.prismaService.user.findUnique({
      where: { id: user.id },
      include: {
        blockedList: true,
      },
    });

    if (!me) {
      throw new Error("User not found");
    }

    return me.blockedList;
  }

  async isUserBlockedById(userId: number, loggedInUser: User) {
    const me = await this.prismaService.user.findUnique({
      where: { id: loggedInUser.id },
      include: {
        blockedList: {
          where: { id: userId },
        },
      },
    });

    if (!me) {
      throw new Error("User not found");
    }

    return me.blockedList.length > 0;
  }

  async getMyFriends(user: User) {
    const me = await this.prismaService.user.findUnique({
      where: { id: user.id },
      include: {
        friends: true,
        blockedList: true,
      },
    });

    if (!me) {
      throw new Error("User not found");
    }

    const blockedUserIds = me.blockedList.map((user) => user.id);
    const filteredFriends = me.friends.filter(
      (friend) => !blockedUserIds.includes(friend.id)
    );

    return filteredFriends;
  }

  async getNonFriends(user: User) {
    const me = await this.prismaService.user.findUnique({
      where: { id: user.id },
      include: {
        friends: true,
      },
    });

    if (!me) throw new Error("User not found");

    const friendIds = me.friends.map((friend) => friend.id);

    const nonFriends = await this.prismaService.user.findMany({
      where: {
        id: { notIn: [user.id, ...friendIds] },
      },
    });
    return nonFriends;
  }

  async getFriendsInCommon(userId: number, friendId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { friends: true },
    });
    if (!user) throw new Error("User not found");

    const friend = await this.prismaService.user.findUnique({
      where: { id: friendId },
      include: { friends: true },
    });
    if (!friend) throw new Error("Friend not found");

    const friendIds = friend.friends.map((friend) => friend.id);
    const friendsInCommon = user.friends.filter((friend) =>
      friendIds.includes(friend.id)
    );

    return friendsInCommon;
  }

  async getFriendsFrom(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { friends: true },
    });
    if (!user) throw new Error("User not found");
    return user.friends;
  }
}
