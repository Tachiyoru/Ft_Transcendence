import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { JwtService } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: "./upload", // Choisissez le répertoire de destination
        filename: (req, file, cb) => {
          const randomName = Array(15)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");

          const originalExtension = extname(file.originalname);
          return cb(null, `${randomName}${originalExtension}`);
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
  
})
export class UserModule {}
