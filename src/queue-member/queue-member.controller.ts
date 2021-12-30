import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { QueueMemberService } from './queue-member.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { QueueMember } from './queue-member.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Queue Member')
@Crud({
  model: {
    type: QueueMember,
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
  path: 'queue-members',
  version: '1',
})
export class QueueMemberController implements CrudController<QueueMember> {
  constructor(public service: QueueMemberService) { }

  get base(): CrudController<QueueMember> {
    return this;
  }

  @Override()
  async deleteOne(@Request() request) {
    return this.service.delete(request.params.id);
  }

  @ApiOperation({ summary: 'Retrieve members list by queue id' })
  @Get('/list/:queue_id')
  async getMembersByQueueId(@Param('queue_id') queueID: string) {
    return await this.service.findManyEntities(
      { where: { user_queue_id: queueID } }
    );
  }
}
