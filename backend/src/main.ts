import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import * as passport from "passport";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

async function bootstrap()
{
	dotenv.config();
	const app = await NestFactory.create(AppModule);

	app.use((req: Request, res: Response, next: NextFunction) =>
	{
		const allowedOrigins = ["http://localhost:5173", "https://api.intra.42.fr"];
		const origin: string | undefined = req.headers.origin;

		if (typeof origin === "string" && allowedOrigins.includes(origin))
		{
			res.setHeader("Access-Control-Allow-Origin", origin);
		}
		res.header(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization, Access-Control-Allow-Headers"
		);
		res.header(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, PATCH, OPTIONS"
		);
		res.setHeader("Access-Control-Allow-Credentials", "true");

		if (req.method === "OPTIONS")
		{
			res.sendStatus(200);
		} else
		{
			next();
		}
	});

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.use(cookieParser());
	app.use(passport.initialize());
	const server = await app.listen(5001);
}
bootstrap();
