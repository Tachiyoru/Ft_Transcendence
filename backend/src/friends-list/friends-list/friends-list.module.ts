import { Module } from '@nestjs/common';
import { FriendsListController } from './friends-list.controller';
import { FriendsListService } from './friends-list.service';

@Module({
  controllers: [FriendsListController],
  providers: [FriendsListService]
})
export class FriendsListModule {}
