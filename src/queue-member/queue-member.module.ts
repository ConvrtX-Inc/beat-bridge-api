import { Module } from '@nestjs/common';
import { QueueMemberController } from './queue-member.controller';
import { QueueMemberService } from './queue-member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueMember } from './queue-member.entity';

@Module({
  controllers: [QueueMemberController],
  providers: [QueueMemberService],
  imports: [TypeOrmModule.forFeature([QueueMember])],
})
export class QueueMemberModule {}
