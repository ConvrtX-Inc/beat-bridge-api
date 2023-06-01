import { Module } from '@nestjs/common';
import { UserQueueController } from './user-queue.controller';
import { UserQueueService } from './user-queue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQueue } from './user-queue.entity';
import { UsersModule } from 'src/users/users.module';
import { HttpModule } from '@nestjs/axios';
import { QueueMember } from 'src/queue-member/queue-member.entity';
import { QueueMemberService } from 'src/queue-member/queue-member.service';
import { User } from 'src/users/user.entity';

@Module({
  controllers: [UserQueueController],
  providers: [UserQueueService,QueueMemberService],
  imports: [UsersModule,HttpModule,TypeOrmModule.forFeature([UserQueue,QueueMember,User ])],
  exports:[UserQueueService]
})
export class UserQueueModule {}
