import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserConnectionService } from './user-connection.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { UserConnection } from './user-connection.entity';
import { SendFriendRequestDto } from './dtos/send-friend-request.dto';
import { FindClosestUsersDto } from '../users/dtos/find-closest-users.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('User Connection')
@Crud({
  model: {
    type: UserConnection,
  },
  routes: {
    only: ['deleteOneBase'],
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
  path: 'user-connections',
  version: '1',
})
export class UserConnectionController
  implements CrudController<UserConnection>
{
  constructor(public service: UserConnectionService) {}

  get base(): CrudController<UserConnection> {
    return this;
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async fetchByUser(@Request() request) {
    return this.service.fetchAllRequest(request.user);
  }

  @Post('send-friend-request')
  @HttpCode(HttpStatus.OK)
  async sendFriendRequestByEmail(
    @Request() request,
    @Body() sendFriendRequestDto: SendFriendRequestDto,
  ) {
    return this.service.sendFriendRequestByEmail(
      request.user,
      sendFriendRequestDto,
    );
  }

  @Override()
  async deleteOne(@Request() request) {
    return this.service.delete(request.params.id);
  }

  @Post('closest-friends')
  @HttpCode(HttpStatus.OK)
  public async getClosesUsers(
    @Body() dto: FindClosestUsersDto,
    @Request() request,
  ) {
    return await this.service.getClosesUsers(
      dto.latitude,
      dto.longitude,
      request.user,
    );
  }
}
