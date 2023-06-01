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
import { TrackHistory } from "./track-history.entity";
import { TrackHistoryService } from './track-history.service'


@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('track-history')
@Crud({
  model: {
    type: TrackHistory,
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

@Controller({ path: 'track-history', version: '1' })

export class TrackHistoryController implements CrudController<TrackHistory>{

  constructor(public service: TrackHistoryService) { }
  get base(): CrudController<TrackHistory> { return this; }
}