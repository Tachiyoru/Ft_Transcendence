import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EditUserDto } from "./dto";
import { UserCreateInput } from "./user-create.input";
import * as argon from "argon2";
import { unlink } from "fs/promises";
import { StatusUser } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.createInitialUser({
      avatar: "/upload/Tachi.png",
      username: "Tachi",
      email: "shanley@test.fr",
      hash: "$argon2id$v=19$m=65536,t=3,p=4$AvmmC2DsXmKaxxA15IXN7g$ABNt5kIwlkksuu2T7fNQrZ2Q/Z1iWxQ3DWubhoqPNOU",
      tittle: "The G.O.A.T",
      role: "ADMIN",
      stats: {
        lvl: 15,
        partyPlayed: 42,
        partyWon: 42,
        partyLost: 0,
        history: ["You would not understand"],
      },
    });
    await this.createInitialUser({
      avatar: "/upload/Manu.png",
      username: "Mansha",
      email: "mansha@test.fr",
      hash: "$argon2id$v=19$m=65536,t=3,p=4$AvmmC2DsXmKaxxA15IXN7g$ABNt5kIwlkksuu2T7fNQrZ2Q/Z1iWxQ3DWubhoqPNOU",
      tittle: "Wow Addict",
      role: "ADMIN",
      stats: {
        lvl: 3,
        partyPlayed: 42,
        partyWon: 0,
        partyLost: 41,
        history: ["You could not wistand this loose series"],
      },
    });
    await this.createInitialUser({
      avatar: "/upload/Clem.png",
      username: "Cremette",
      email: "creme@test.fr",
      hash: "$argon2id$v=19$m=65536,t=3,p=4$AvmmC2DsXmKaxxA15IXN7g$ABNt5kIwlkksuu2T7fNQrZ2Q/Z1iWxQ3DWubhoqPNOU",
      tittle: "La Ptite Creme",
      role: "ADMIN",
      stats: {
        lvl: 1,
        partyPlayed: 1,
        partyWon: 0,
        partyLost: 1,
        history: ["just a noob"],
      },
    });
  }

  private async createInitialUser(userinput: UserCreateInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: userinput.username,
      },
    });
    if (!user) {
      await this.prisma.user.create({
        data: {
          username: userinput.username ?? "",
          avatar: userinput.avatar ?? "",
          email: userinput.email ?? "",
          hash: userinput.hash ?? "",
          tittle: userinput.tittle ?? "",
          role: userinput.role ?? "USER",
          stats: {
            create: {
              lvl: userinput.stats.lvl ?? 1,
              partyPlayed: userinput.stats.partyPlayed ?? 0,
              partyWon: userinput.stats.partyWon ?? 0,
              partyLost: userinput.stats.partyLost ?? 0,
              history: userinput.stats.history ?? [],
            },
          },
        },
      });
    }
  }

  async getUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { friends: true, stats: true, achievements: true },
    });
  }

  async getAllUsers(userId: number) {
    return this.prisma.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
      },
    });
  }

  async getAllOnlineUsers() {
    return this.prisma.user.findMany({
      where: {
        status: StatusUser.ONLINE,
      },
    });
  }

  async deleteUser(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (user) {
      if (user.avatar && user.avatar.startsWith("/upload")) {
        await unlink(user.avatar); //attention a la suppression de l'avatar
      }
      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
    }
  }

  async deleteAvatar(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (user) {
      if (user.avatar && user.avatar.startsWith("/upload")) {
        await unlink(user.avatar);
      }
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          avatar: null,
        },
      });
    }
  }

  async editAvatar(userId: number, file: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (file) {
      if (user) {
        if (user.avatar && user.avatar.startsWith("/upload")) {
          await unlink(user.avatar);
        }
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            avatar: file,
          },
        });
      }
    }
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (user) {
      if (dto.password) {
        const pwdMatches = await argon.verify(user.hash ?? "", dto.password);
        if (!pwdMatches) {
          throw new BadRequestException("Invalid password");
        }
      }
      if (dto.newPassword) {
        dto.password = await argon.hash(dto.newPassword);
      }
    }
    const { password, username: newusername } = dto;
    const user2 = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hash: password,
        username: newusername,
      },
    });
    return user2;
  }

  async getRankingGlobal() {
    const rank = await this.prisma.user.findMany({
      include: {
        stats: true,
      },
      orderBy: {
        stats: { lvl: "desc" },
      },
    });
    return rank;
  }

  async getRankingFriends(userId: number) {
    const rank = await this.prisma.user.findMany({
      include: {
        friends: true,
        stats: true,
      },
      where: {
        friends: {
          some: {
            id: userId,
          },
        },
      },
      orderBy: {
        stats: { lvl: "desc" },
      },
    });
    return rank;
  }

  async getRankingFriendsHim(name: string) {
    const rank = await this.prisma.user.findMany({
      include: {
        friends: true,
        stats: true,
      },
      where: {
        friends: {
          some: {
            username: name,
          },
        },
      },
      orderBy: {
        stats: { lvl: "desc" },
      },
    });
    return rank;
  }

  async getHim(name: string) {
    return this.prisma.user.findUnique({
      where: { username: name },
    });
  }
}
