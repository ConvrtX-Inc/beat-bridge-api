import { Body, Controller, Get, HttpStatus, Param, Post,Patch, Req, Request, UseGuards } from '@nestjs/common';
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
import {SysSupport} from './support.entity';
import {SysSupportService} from './support.service';
import { request } from 'express';
import { UpdateStatusDto } from './dto/status-update.dto';


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
    join:{
      status:{
        eager:false
      }
    }
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    } 
  },
})
@Controller({ path: 'support',version: '1'})
export class SysSupportController implements CrudController<SysSupport> {

  constructor(public service: SysSupportService) {}
  get base(): CrudController<SysSupport> {return this;}


  //Get SysSupport for a user
  @ApiOperation({ summary: 'Retrieve members list by user id' })
  @Get('/:userId')
  async getMembersByQueueId(@Param('userId') userId: string) {
    const supportTickets = await this.service.findManyEntities({
      where: { user_id: userId }
    });
    return supportTickets;
  }

  @ApiOperation({ summary: 'Update ticket status' })
  @Post('status')
  async updateStatus(@Request() req:CrudRequest,@Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(req,dto);
  }
}
