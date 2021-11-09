import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Avatar } from './avatar.entity';
import { AvatarService } from './avatar.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Avatar')
@Crud({
  model: {
    type: Avatar,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    maxLimit: 50,
    alwaysPaginate: false
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
  path: 'avatar',
  version: '1',
})
export class AvatarController implements CrudController<Avatar> {
  constructor(public service: AvatarService) {}

  get base(): CrudController<Avatar> {
    return this;
  }
}
