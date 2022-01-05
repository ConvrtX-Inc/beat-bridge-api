import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import { QueuePlaylistService } from './queue-playlist.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Crud, CrudController } from '@nestjsx/crud';
import { QueuePlaylist } from './queue-playlist.entity';
import { SourcePlatformDto } from './dtos/source-platform.dto';
import { QueueCreatorDto } from './dtos/queue-creator.dto';
import { QueueNearMeDto } from './dtos/queue-near-me.dto';
import { QueueCreatedDateDto } from './dtos/queue-created-date.dto';
import { QueueNameDto } from './dtos/queue-name.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Queue Playlists')
@Crud({
  model: {
    type: QueuePlaylist,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    maxLimit: 50,
    alwaysPaginate: false,
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
})
@Controller({
  path: 'queue-playlists',
  version: '1',
})
export class QueuePlaylistController implements CrudController<QueuePlaylist> {
  constructor(public service: QueuePlaylistService) {}

  get base(): CrudController<QueuePlaylist> {
    return this;
  }

  @ApiOperation({ summary: 'Retrieve data by source platform' })
  @Post('/get-source-platform')
  public async getSourcePlatform(@Body() dto: SourcePlatformDto) {
    return await this.service.getSourcePlatform(dto);
  }

  @ApiOperation({ summary: 'Retrieve data by queue creator' })
  @Post('/get-queue-creator')
  public async getQueueCreator(@Body() dto: QueueCreatorDto) {
    return await this.service.getQueueCreator(dto);
  }

  @ApiOperation({ summary: 'Retrieve data by queue near me' })
  @Post('/get-queue-near-me')
  public async getQueueNearMe(@Body() dto: QueueNearMeDto) {
    return await this.service.getQueueNearMe(dto);
  }

  @ApiOperation({ summary: 'Retrieve data by created date' })
  @Post('/get-queue-created-date')
  public async getQueueCreatedDate(@Body() dto: QueueCreatedDateDto) {
    return await this.service.getQueueCreatedDate(dto);
  }

  @ApiOperation({ summary: 'Retrieve data by queue name' })
  @Post('/get-queue-name')
  public async getQueueName(@Body() dto: QueueNameDto) {
    return await this.service.getQueueName(dto);
  }

  @ApiOperation({ summary: 'Retrieve queue songs by queue id' })
  @Get('/get-queue-songs/:queue_id')
  public async getQueueSongs(@Param('queue_id') queue_id: string) {
    return await this.service.findManyEntities(
      { where: { user_queue_id: queue_id } }
    );
  }

  @ApiOperation({ summary: 'Increment total play count' })
  @HttpCode(HttpStatus.OK)
  @Put('/increment-play-count/:playlist_id')
  public async incrementPlayCount(@Param('playlist_id') playlist_id: string) {
    return this.service.incrementTotalPlayCount(playlist_id);
  }

  @ApiOperation({ summary: 'Get Most Played Songs' })
  @Get('/most-played/:queue_id')
  public async getMostPlayedSongs(@Param('queue_id') queue_id: string) {
    return this.service.getMostPlayed(queue_id);
  }
}
