import { Body, Controller, Get, HttpStatus, Param, Post, Patch, Req, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { MasterSupport } from "./master-support.entity";
import { MasterSupportService } from "./master-support.service";


@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('master-support')
@Crud({
  model: {
    type: MasterSupport,
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
    }
  },
})

@Controller({ path: 'master-support', version: '1' })

export class MasterSupportController implements CrudController<MasterSupport>{

  constructor(public service: MasterSupportService) { }
  get base(): CrudController<MasterSupport> { return this; }
}