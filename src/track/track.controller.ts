import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { request } from 'http';
import { FindClosestUsersDto } from 'src/users/dtos/find-closest-users.dto';
import { DeleteDto, TrackDto } from './dto/track.dto';
import { TrackService } from './track.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(public service: TrackService) {}

  @Get('song-played/:id')
  @HttpCode(HttpStatus.OK)
  public async songPlayed(@Param('id') id:string, @Request() request){
    return this.service.playCount(id);
  }

  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  public async userTracks(@Param('id') id:string,@Query() query){  
     return this.service.userTracks(id,query.limit);
  }

  @Get('queue/:id')
  @ApiOperation({summary : "Return all the Track Using Queue_id"})
  @HttpCode(HttpStatus.OK)
  public async queueTracks(@Param('id') id:string){   
    console.log(id);
     return this.service.queueTracks(id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(@Body() dto: TrackDto, @Request() request) {    
    return await this.service.create(dto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  public async delete(@Body() dto: DeleteDto, @Request() request) {
    return await this.service.remove(dto);
  }

  @Get('/:id')
  async getFriends(@Param('id') id: string, @Request() request) {
    return this.service.getQueue(id);
  }

  @Get('top-played/:id')
  @HttpCode(HttpStatus.OK)
  async topPlayed(@Param('id')id:string, @Request() req, @Query() query){
    return await this.service.topPlayed( id,req.user, query.limit)
  }
}
