import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscriptionController } from './user-subscription.controller';
import { UserSubscriptionService } from './user-subscription.service';
import { UserSubscription } from './user-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSubscription])],
  controllers: [UserSubscriptionController],
  providers: [UserSubscriptionService],
  exports: [UserSubscriptionService]
})
export class UserSubscriptionModule {}


