import { Module } from '@nestjs/common';
import { QueuePlaylistController } from './queue-playlist.controller';
import { QueuePlaylistService } from './queue-playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueuePlaylist } from './queue-playlist.entity';

@Module({
  controllers: [QueuePlaylistController],
  providers: [QueuePlaylistService],
  imports: [TypeOrmModule.forFeature([QueuePlaylist])],
})
export class QueuePlaylistModule {}
