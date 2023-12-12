import { Injectable, Req } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FriendsListService {
  constructor(private prismaService: PrismaService) {}

  async addFriend(user: User, friendId: number) {
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
          connect: { id: friendId }, // connect existing friend
        },
      },
      include: { friends: true }, // inlcude friends in the response
    });

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

    return user;
  }

  async getMyFriends(user: User) {
    const me = await this.prismaService.user.findUnique({
      where: { id: user.id },
      include: { friends: true },
    });
    if (!me) throw new Error("User not found");
    return me.friends;
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
    console.log(friendIds);

    const nonFriends = await this.prismaService.user.findMany({
      where: {
        id: { notIn: [user.id, ...friendIds] },
      },
    });
    return nonFriends;
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
