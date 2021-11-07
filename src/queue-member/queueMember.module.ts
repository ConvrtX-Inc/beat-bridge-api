import { Module } from '@nestjs/common';
import { QueueMemberController } from './queueMember.controller';
import { QueueMemberService } from './queueMember.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueMember } from './queueMember.entity';

@Module({
  controllers: [QueueMemberController],
  providers: [QueueMemberService],
  imports: [TypeOrmModule.forFeature([QueueMember])],
})
export class QueueMemberModule {}
