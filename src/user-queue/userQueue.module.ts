import { Module } from '@nestjs/common';
import { UserQueueController } from './userQueue.controller';
import { UserQueueService } from './userQueue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQueue } from './userQueue.entity';

@Module({
  controllers: [UserQueueController],
  providers: [UserQueueService],
  imports: [TypeOrmModule.forFeature([UserQueue])],
})
export class UserQueueModule {}
