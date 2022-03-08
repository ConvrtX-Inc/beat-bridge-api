import { Controller, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import {SysSupport} from './support.entity';
import {SysSupportService} from './support.service';


@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Support')
@Crud({
  model: {
    type: SysSupport,
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
@Controller({ path: 'support',version: '1'})
export class SysSupportController {

constructor(
    public service: SysSupportService
  ) {}

  get base(): CrudController<SysSupport> {
    return this;
  }





}
