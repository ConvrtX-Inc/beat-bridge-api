import { Controller, Request, UseGuards } from '@nestjs/common';
import { QueueMemberService } from './queue-member.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  constructor(public service: QueueMemberService) {}

  get base(): CrudController<QueueMember> {
    return this;
  }

  @Override()
  async deleteOne(@Request() request) {
    return this.service.delete(request.params.id);
  }
}
