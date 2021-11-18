import { Controller, Request, UseGuards } from '@nestjs/common';
import { QueuePlaylistService } from './queue-playlist.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Crud, CrudController } from '@nestjsx/crud';
import { QueuePlaylist } from './queue-playlist.entity';

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
}
