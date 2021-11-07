import { Controller, Request, UseGuards } from '@nestjs/common';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import validationOptions from 'src/utils/validation-options';

@ApiBearerAuth()
@ApiTags('Users')
@Crud({
  validation: validationOptions,
  model: {
    type: User,
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

  @Override()
  async deleteOne(@Request() request) {
    return this.service.softDelete(request.params.id);
  }
}
