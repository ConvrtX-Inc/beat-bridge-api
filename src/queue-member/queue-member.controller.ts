import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { QueueMemberService } from './queue-member.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { QueueMember } from './queue-member.entity';
import { UsersService } from '../users/users.service';

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
  constructor(
    public service: QueueMemberService,
    public userService: UsersService,
  ) {}

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
    const returnResponse = [];
    const queuedUsers = await this.service.findManyEntities({
      where: { user_queue_id: queueID },
    });
    const tempUser = [];
    const tempUserQueue = [];
    let user = {};
    let userQueue = {};
    if (queuedUsers instanceof Array) {
      for (const i in queuedUsers) {
        let data = {
          user: undefined,
          user_queue: undefined,
        };
        data = queuedUsers[i];

        if (!tempUser.includes(queuedUsers[i].user_id)) {
          tempUser.push(queuedUsers[i].user_id);
          user = await this.userService.findOne({
            id: queuedUsers[i].user_id,
          });
        }
        if (!tempUserQueue.includes(queuedUsers[i].user_queue_id)) {
          tempUserQueue.push(queuedUsers[i].user_queue_id);
          userQueue = await this.userService.findOne({
            id: queuedUsers[i].user_queue_id,
          });
        }
        data.user = user;
        data.user_queue = userQueue;
        returnResponse.push(data);
      }
    }
    return returnResponse;
  }

  @Override('getManyBase')
  async getMany(@ParsedRequest() req: CrudRequest) {
    const returnResponse = [];
    req.parsed.sort = [{ field: 'created_date', order: 'DESC' }];
    const queuedUsers = await this.service.getMany(req);
    const tempUser = [];
    const tempUserQueue = [];
    let user = {};
    let userQueue = {};
    if (queuedUsers instanceof Array) {
      for (const i in queuedUsers) {
        let data = {
          user: undefined,
          user_queue: undefined,
        };
        data = queuedUsers[i];

        if (!tempUser.includes(queuedUsers[i].user_id)) {
          tempUser.push(queuedUsers[i].user_id);
          user = await this.userService.findOne({
            id: queuedUsers[i].user_id,
          });
        }
        if (!tempUserQueue.includes(queuedUsers[i].user_queue_id)) {
          tempUserQueue.push(queuedUsers[i].user_queue_id);
          userQueue = await this.userService.findOne({
            id: queuedUsers[i].user_queue_id,
          });
        }
        data.user = user;
        data.user_queue = userQueue;
        returnResponse.push(data);
      }
    }
    return returnResponse;
  }
}
