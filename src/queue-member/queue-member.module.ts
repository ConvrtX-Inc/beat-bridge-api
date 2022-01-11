import { Module } from '@nestjs/common';
import { QueueMemberController } from './queue-member.controller';
import { QueueMemberService } from './queue-member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueMember } from './queue-member.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [QueueMemberController],
  providers: [QueueMemberService],
  imports: [UsersModule, TypeOrmModule.forFeature([QueueMember])],
})
export class QueueMemberModule {}
