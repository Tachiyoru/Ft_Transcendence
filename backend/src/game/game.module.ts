import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameGateway } from './game.gateway';
// import { GameController } from './game.controller';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	providers: [GameGateway, GameService, PrismaService, JwtService],
})
export class GameModule {}
