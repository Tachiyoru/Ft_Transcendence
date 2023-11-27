import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EditUserDto } from "./dto";
import { UserCreateInput } from "./user-create.input";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.createInitialUser({
      avatar: "/upload_permanent/Tachi.png",
      username: "Tachi",
      email: "shanley@test.fr",
      hash: "$argon2id$v=19$m=65536,t=3,p=4$AvmmC2DsXmKaxxA15IXN7g$ABNt5kIwlkksuu2T7fNQrZ2Q/Z1iWxQ3DWubhoqPNOU",
      tittle: "The G.O.A.T",
      role: "ADMIN",
    });
    await this.createInitialUser({
      avatar: "",
      username: "Mansha",
      email: "mansha@test.fr",
      hash: "$argon2id$v=19$m=65536,t=3,p=4$AvmmC2DsXmKaxxA15IXN7g$ABNt5kIwlkksuu2T7fNQrZ2Q/Z1iWxQ3DWubhoqPNOU",
      tittle: "Wow Addict",
      role: "ADMIN",
    });
    await this.createInitialUser({
      avatar: "",
      username: "Cremette",
      email: "creme@test.fr",
      hash: "$argon2id$v=19$m=65536,t=3,p=4$AvmmC2DsXmKaxxA15IXN7g$ABNt5kIwlkksuu2T7fNQrZ2Q/Z1iWxQ3DWubhoqPNOU",
      tittle: "La Ptite Creme",
      role: "ADMIN",
    });
  }

  private async createInitialUser(userinput: UserCreateInput) {
    const user = await this.prisma.user.findFirst();
    if (!user) {
      await this.prisma.user.create({
        data: {
          avatar: userinput.avatar ?? "",
          email: userinput.email ?? "",
          hash: userinput.hash ?? "",
          username: userinput.username ?? "",
          tittle: userinput.tittle ?? "",
          role: userinput.role ?? "USER",
        },
      });
    }
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    return user;
  }
}
