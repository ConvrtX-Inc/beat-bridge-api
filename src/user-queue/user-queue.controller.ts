import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query
} from '@nestjs/common';
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
import { QueueMember } from '../queue-member/queue-member.entity';
import { UsersService } from '../users/users.service';
import { UpdateUserQueueImageDto, CreateCustomQueueDto, CreatePlatformQueueDto, NearbyQueuesDto } from './dto/update-user-queue-image.dto';
import { Track } from 'src/track/track.entity';
import { request } from 'http';
import e from 'express';

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
  ) { }

  get base(): CrudController<UserQueue> {
    return this;
  }

  // To add Custome Queue
  @Override('createOneBase')
  async createCustomeQueue(@Body() body: CreateCustomQueueDto, @Request() req) {
    return this.service.createCustomeQueue(body, req.user)
  }


  // To Add Queue from Platform like spotify
  @Post('add')
  async addQueue(@Body() queueData: CreatePlatformQueueDto) {
    return this.service.addQueue(queueData);
  }

  @Get('data/:id')
  @HttpCode(HttpStatus.OK)
  async getUserQueues(@Param('id') id: string, @Request() req) {
    const returnResponse = [];
    const usersqueue = await this.service.getUserQueues(id);
    const tempUser = [];
    let user = {};
    if (usersqueue instanceof Array) {
      for (const i in usersqueue) {
        let data = {
          user: undefined,
          total_queue_tracks: undefined,
          is_member: undefined,
        };
        data = usersqueue[i];

        if (!tempUser.includes(usersqueue[i].user_id)) {
          tempUser.push(usersqueue[i].user_id);
          user = await this.userService.findOne({
            id: usersqueue[i].user_id,
          });
        }
        //To find Total.no of Tracks in a Queue
        const tracks = await Track.count({
          queueId: usersqueue[i].id
        });

        // Check the Current User is Queue Member or Not 
        const isMember = await QueueMember.findOne({
          user_id: req.user.id,
          user_queue_id: usersqueue[i].id
        })
        if (!isMember && usersqueue[i].user_id != req.user.id) {
          data.is_member = false;
        } else {
          data.is_member = true;
        }


        // Check if Current user is Admin of the Queue
        if (usersqueue[i].user_id == req.user.id) {
          data['is_admin'] = true
        } else {
          data['is_admin'] = false
        }

        if (isMember) {
          if (isMember.is_admin == true) {
            data['is_admin'] = true
          }
        }
        data.total_queue_tracks = tracks;
        data.user = user;
        returnResponse.push(data);
      }
      return returnResponse;
    }
  }

  @Post('nearby')
  async getMany(@Query() query, @ParsedRequest() req: CrudRequest, @Request() request , @Body() nearbyQueuesDro:NearbyQueuesDto) {   
    const returnResponse = [];
    // req.parsed.sort = [{ field: 'created_date', order: 'DESC' }];
    const users = await this.service.getManyQueues( nearbyQueuesDro ,query.limit, request.user.id);
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
        //To find Total.no of Tracks in a Queue
        const tracks = await Track.count({
          queueId: users[i].id
        });

        // Check the Current User is Queue Member or Not 
        const isMember = await QueueMember.findOne({
          user_id: request.user.id,
          user_queue_id: users[i].id
        })

        if (!isMember && users[i].user_id != request.user.id) {
          data['is_member'] = false;
        } else {
          data['is_member'] = true;
        }

        // Check if Current user is Admin of the Queue
        if (users[i].user_id == request.user.id) {
          data['is_admin'] = true
        } else {
          data['is_admin'] = false
        }

        if (isMember) {
          if (isMember.is_admin == true) {
            data['is_admin'] = true
          }
        }
        data['total_queue_tracks'] = tracks;
        data.user = user;
        returnResponse.push(data);
      }
      return returnResponse;
    }
  }

  @Override('getOneBase')
  async getOne(@ParsedRequest() req: CrudRequest, @Param('id') id, @Request() request) {
    const user = await this.service.getOne(req);
    let data = {
      user: undefined,
    };
    data = user;
    data.user = await this.userService.findOne({
      id: user.user_id,
    });
    //To find Total.no of Tracks in a Queue
    const tracks = await Track.count({
      queueId: id
    });

    // Check the Current User is Queue Member or Not 
    const isMember = await QueueMember.findOne({
      user_id: request.user_id,
      user_queue_id: user.id
    });
    if (!isMember && user.user_id != request.user.id) {
      data['is_member'] = false;
    } else {
      data['is_member'] = true;
    }

    // Check if Current user is Admin of the Queue
    if (user.user_id == request.user.id) {
      data['is_admin'] = true
    } else {
      data['is_admin'] = false
    }
    if (isMember) {
      if (isMember.is_admin == true) {
        data['is_admin'] = true
      }
    }
    data['total_queue_tracks'] = tracks;
    return data;
  }

  @Override()
  async deleteOne(@Request() request) {
    return this.service.delete(request.params.id);
  }

  @ApiOperation({ summary: 'Update Queue Image' })
  @Patch('image')
  async updateImage(@Request() req, @Body() dto: UpdateUserQueueImageDto) {
    return this.service.updateImage(req.user.id, dto);
  }
}
