import { Controller, Request, UseGuards } from '@nestjs/common';
import { UserQueueService } from './user-queue.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { UserQueue } from './user-queue.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('User Queue')
@Crud({
  model: {
    type: UserQueue,
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
  path: 'user-queues',
  version: '1',
})
export class UserQueueController implements CrudController<UserQueue> {
  constructor(public service: UserQueueService) {}

  get base(): CrudController<UserQueue> {
    return this;
  }

  @Override()
  async deleteOne(@Request() request) {
    return this.service.delete(request.params.id);
  }
}
