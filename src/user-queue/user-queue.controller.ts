import { Body, Controller, Delete, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UserQueueService } from './user-queue.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { UserQueue } from './user-queue.entity';
import { UsersService } from '../users/users.service';
import { UpdateUserQueueImageDto } from './dto/update-user-queue-image.dto';

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
  constructor(
    public service: UserQueueService,
    public userService: UsersService,
  ) {}

  get base(): CrudController<UserQueue> {
    return this;
  }

  @Override('getManyBase')
  async getMany(@ParsedRequest() req: CrudRequest) {
    const returnResponse = [];
    req.parsed.sort = [{ field: 'created_date', order: 'DESC' }];
    const users = await this.service.getMany(req);
    const tempUser = [];
    let user = {};
    if (users instanceof Array) {
      for (const i in users) {
        let data = {
          user: undefined,
        };
        data = users[i];

        if (!tempUser.includes(users[i].user_id)) {
          tempUser.push(users[i].user_id);
          user = await this.userService.findOne({
            id: users[i].user_id,
          });
        }
        data.user = user;
        returnResponse.push(data);
      }
      return returnResponse;
    }
  }

  @Override('getOneBase')
  async getOne(@ParsedRequest() req: CrudRequest) {
    const user = await this.service.getOne(req);
    let data = {
      user: undefined,
    };
    data = user;

    data.user = await this.userService.findOne({
      id: user.user_id,
    });

    return data;
  }

  @Override()
  async deleteOne(@Request() request) {
    return this.service.delete(request.params.id);
  }

  @ApiOperation({ summary: 'Update Queue Image' })
  @Patch('image')
  async updateImage(@Request() req,@Body() dto: UpdateUserQueueImageDto) {
    return this.service.updateImage(req.user.id,dto);
  }

  @Delete('/remove-friend/:id')
  async removeFriend(@Param('id') id: string) {
   return this.service.deleteFriend(id);
  }

}
