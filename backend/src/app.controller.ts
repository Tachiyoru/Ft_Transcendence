import { Controller, Get, Post, Req, Request, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { TokenGuard } from "./auth/guard/token.guard";

@Controller()
export class AppController
{
	constructor(private readonly appService: AppService) {}

	@UseGuards(TokenGuard)
	@Get("hello")
	async getUserData(@Request() req: any)
	{
		const user = req.user;
		console.log("print user", user);
	}
	getHello(@Req() req: any): string
	{
		return this.appService.getHello();
	}
}
