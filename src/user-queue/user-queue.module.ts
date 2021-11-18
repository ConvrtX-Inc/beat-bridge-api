import { Module } from '@nestjs/common';
import { UserQueueController } from './user-queue.controller';
import { UserQueueService } from './user-queue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQueue } from './user-queue.entity';

@Module({
  controllers: [UserQueueController],
  providers: [UserQueueService],
  imports: [TypeOrmModule.forFeature([UserQueue])],
})
export class UserQueueModule {}
