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
/// le middleware est appliqué sur toutes les routes sauf sur les routes precisées dans le exclude, 
//il va s'appliquer a chaque route et verifier que l'utilisateur est bien log sinon il retournera une redirection vers la page signin/up a voir
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude("/auth/signup", "/auth/signin", "/auth/42/callback", "/auth/42")
      .forRoutes("*");
    // console.log("JwtAuthMiddleware applied");
  }
}
