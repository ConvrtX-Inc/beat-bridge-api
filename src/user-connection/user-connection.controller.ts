import {
  Body,
  Controller,
  Delete,
  Param,
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
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { UserConnection } from './user-connection.entity';
import { SendFriendRequestDto } from './dtos/send-friend-request.dto';
import { FindClosestUsersDto } from '../users/dtos/find-closest-users.dto';
import { UsersService } from '../users/users.service';
import { AddFriendDto } from './dtos/add-friend-request.dto';
import { ConfirmDto } from './dtos/confirm-request.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('User Connection')
@Crud({
  model: {
    type: UserConnection,
  },
  routes: {
    only: ['deleteOneBase', 'getManyBase', 'getOneBase'],
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
  constructor(
    public service: UserConnectionService,
    public userService: UsersService,
  ) {}

  get base(): CrudController<UserConnection> {
    return this;
  }

  @Override('getManyBase')
  async getMany(@ParsedRequest() req: CrudRequest) {
    const returnResponse = [];
    req.parsed.sort = [{ field: 'created_date', order: 'DESC' }];
    const users = await this.service.getMany(req);
    const tempToUser = [];
    const tempFromUser = [];
    let to_user = {};
    let from_user = {};
    if (users instanceof Array) {
      for (const i in users) {
        let data = {
          to_user: undefined,
          from_user: undefined,
        };
        data = users[i];

        if (!tempToUser.includes(users[i].to_user_id)) {
          tempToUser.push(users[i].to_user_id);
          to_user = await this.userService.findOne({
            id: users[i].to_user_id,
          });
        }
        if (!tempFromUser.includes(users[i].from_user_id)) {
          tempFromUser.push(users[i].from_user_id);
          from_user = await this.userService.findOne({
            id: users[i].from_user_id,
          });
        }
        data.to_user = to_user;
        data.from_user = from_user;
        returnResponse.push(data);
      }
      return returnResponse;
    }
  }

  @Override('getOneBase')
  async getOne(@ParsedRequest() req: CrudRequest) {
    const user = await this.service.getOne(req);
    let data = {
      to_user: undefined,
      from_user: undefined,
    };
    data = user;

    data.to_user = await this.userService.findOne({
      id: user.to_user_id,
    });
    data.from_user = await this.userService.findOne({
      id: user.from_user_id,
    });

    return data;
  }



  @Override()
  async deleteOne(@Request() request) {
    return this.service.delete(request.params.id);
  }

  @Post('nearest-friends')
  @HttpCode(HttpStatus.OK)
  public async getNearestUsers(
    @Body() dto: FindClosestUsersDto,
    @Request() request,
  ) {
    return await this.service.getClosesUsers(
      dto.latitude,
      dto.longitude,
      request.user,
    );
  }


  
  @Post('closest')
  @HttpCode(HttpStatus.OK)
  public async getCloseUsersForRequest(
    @Body() dto: FindClosestUsersDto,
    @Request() request,
  ) {
    return await this.service.getCloseUsersForRequest(
      dto.latitude,
      dto.longitude,
      request.user,
    );
  }



  @Delete('/remove-friend/:id')
  async removeFriend(@Param('id') id: string) {
   return this.service.deleteFriend(id);
  }

  @Post('add-friend')
  @HttpCode(HttpStatus.OK)
  async addFriend(@Request() request,@Body() dto: AddFriendDto,) {
    
    return this.service.addFriendRequest( request.user, dto,);
  
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

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  async confirm(
    @Request() request,
    @Body() confirmDto: ConfirmDto,
  ) {
    return this.service.confirm(
      request.user,
      confirmDto,
    );
  }



  @Get('/friends/:id')
  async getFriends(@Param('id') id: string,@Request() request) {

    return this.service.getFriends(request.user);
  }

  @Get('/friends/received/:id')
  async getReceivedRequest(@Param('id') id: string,@Request() request) {

    return this.service.getReceivedRequests(request.user);
  }

  @Get('/friends/sent/:id')
  async getSentRequest(@Param('id') id: string,@Request() request) {

    return this.service.getSentRequests(request.user);
  }
  
}
