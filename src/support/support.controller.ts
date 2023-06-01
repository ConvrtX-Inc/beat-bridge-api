import { Body, Controller, Get, HttpStatus, Param, Post,Patch, Req, Request, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  Crud,
  CrudController,
  Override,
} from '@nestjsx/crud';
import {SysSupport} from './support.entity';
import {SysSupportService} from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Support')
@Crud({
  model: {
    type: SysSupport,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase','deleteOneBase','updateOneBase'],
  },
  dto : {
    create : CreateSupportDto
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
  @Get('/:user_id')
  async getMembersByQueueId(@Param('user_id') user_id: string) {
    const supportTickets = await this.service.findManyEntities({
      where: { user_id: user_id }
    });
    return supportTickets;
  }  

  @Override('getManyBase')
  async getManySupport(@Query() query){
    console.log(query.limit);
    return await this.service.getManySupport(query.limit);
  }

  @Get('completed/:id')
  async changeStatusToCompleted(@Param('id') id){
    return await this.service.changeStatusToCompleted(id);

  }
}
