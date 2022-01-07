import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import validationOptions from 'src/utils/validation-options';
import { FindClosestUsersDto } from './dtos/find-closest-users.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Users')
@Crud({
  validation: validationOptions,
  model: {
    type: User,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    maxLimit: 50,
    alwaysPaginate: false,
    join: {
      role: {
        eager: false,
      },
      status: {
        eager: false,
      },
      photo: {
        eager: false,
      },
    },
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
  path: 'users',
  version: '1',
})
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}

  get base(): CrudController<User> {
    return this;
  }

  @Override('getOneBase')
  async getOneAndDoStuff(@Request() req) {
    return this.service.getOneBase(req.params.id);
  }

  @Override()
  async deleteOne(@Request() request) {
    return this.service.softDelete(request.params.id);
  }

  @Post('nearest-users')
  @HttpCode(HttpStatus.OK)
  public async getClosestUsers(@Body() dto: FindClosestUsersDto) {
    return await this.service.getClosestUsers(dto.latitude, dto.longitude);
  }
}
