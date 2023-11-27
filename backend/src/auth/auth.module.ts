import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtAuthMiddleware } from "./strategy/jwt-auth.middleware";
import { FortyTwoStrategy } from "./strategy/42.strategy";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({ secret: "feur", signOptions: { expiresIn: "3h" } }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FortyTwoStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude("/auth/signup", "/auth/signin", "/auth/42Auth")
      .forRoutes("*");
    console.log("JwtAuthMiddleware applied");
  }
}
