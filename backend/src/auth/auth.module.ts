import { Module, } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { FortyTwoStrategy } from "./strategy/42.strategy";
import { GithubStrategy } from "./strategy/github.strategy";
import { TwoFAService } from "./twoFA/two-fa/two-fa.service";
import { TwoFaController } from "./twoFA/two-fa/two-fa.controller";

@Module({
	imports: [JwtModule],
	controllers: [AuthController, TwoFaController],
	providers: [AuthService, FortyTwoStrategy, GithubStrategy, TwoFAService],
})

export class AuthModule {}