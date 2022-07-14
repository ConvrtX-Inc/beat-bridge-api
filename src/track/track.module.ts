import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQueueModule } from 'src/user-queue/user-queue.module';
import { Track } from './track.entity';
import { UserQueueService } from 'src/user-queue/user-queue.service';

@Module({
  imports:[UserQueueModule,TypeOrmModule.forFeature([Track])],
  providers: [TrackService],
  controllers: [TrackController],
  exports:[TrackService]
})
export class TrackModule {}
