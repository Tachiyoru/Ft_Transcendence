import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	controllers: [NotificationController],
	providers: [NotificationService, JwtService]
})
export class NotificationModule {}
