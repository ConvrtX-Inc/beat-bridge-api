import { Module } from '@nestjs/common';
import { UserQueueController } from './user-queue.controller';
import { UserQueueService } from './user-queue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQueue } from './user-queue.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [UserQueueController],
  providers: [UserQueueService],
  imports: [UsersModule, TypeOrmModule.forFeature([UserQueue])],
})
export class UserQueueModule {}
