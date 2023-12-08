import { Module } from '@nestjs/common';
import { FriendsListController } from './friends-list.controller';
import { FriendsListService } from './friends-list.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	controllers: [FriendsListController],
	providers: [FriendsListService, JwtService],
})
export class FriendsListModule {}
