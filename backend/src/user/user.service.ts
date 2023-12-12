import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EditUserDto } from "./dto";
import { UserCreateInput } from "./user-create.input";
import * as argon from "argon2";
import { unlink } from "fs/promises";

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
    });
    await this.createInitialUser({
      avatar: "/upload/Manu.png",
      username: "Mansha",
      email: "mansha@test.fr",
      hash: "$argon2id$v=19$m=65536,t=3,p=4$AvmmC2DsXmKaxxA15IXN7g$ABNt5kIwlkksuu2T7fNQrZ2Q/Z1iWxQ3DWubhoqPNOU",
      tittle: "Wow Addict",
      role: "ADMIN",
    });
    await this.createInitialUser({
      avatar: "/upload/Clem.png",
      username: "Cremette",
      email: "creme@test.fr",
      hash: "$argon2id$v=19$m=65536,t=3,p=4$AvmmC2DsXmKaxxA15IXN7g$ABNt5kIwlkksuu2T7fNQrZ2Q/Z1iWxQ3DWubhoqPNOU",
      tittle: "La Ptite Creme",
      role: "ADMIN",
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
        },
      });
    }
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async editAvatar(userId: number, file: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (file) {
      if (user) {
        if (user.avatar) {
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
    console.log("id : ", userId);
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
}
