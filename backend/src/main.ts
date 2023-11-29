import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as dotenv from 'dotenv';

async function bootstrap()
{
	dotenv.config();
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: 'http://localhost:5173',
		allowedHeaders: 'Content-Type,Authorization',
		credentials: true,
	});
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.use(cookieParser());
	app.use(passport.initialize());
	await app.listen(5001);
}
bootstrap();
