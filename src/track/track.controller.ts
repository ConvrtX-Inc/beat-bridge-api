import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindClosestUsersDto } from 'src/users/dtos/find-closest-users.dto';
import { DeleteDto, TrackDto } from './dto/track.dto';
import { TrackService } from './track.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Track')
@Controller('track')
export class TrackController {

    constructor(public service:TrackService){}



    @Post()
    @HttpCode(HttpStatus.OK)
    public async create(
      @Body() dto: TrackDto,
      @Request() request,
    ) {
      return await this.service.create(dto);
    }
  
    @Delete()
    @HttpCode(HttpStatus.OK)
    public async delete(
      @Body() dto: DeleteDto,
      @Request() request,
    ) {
      return await this.service.remove(dto);
    }

    @Get('/:id')
    async getFriends(@Param('id') id: string,@Request() request) {
  
      return this.service.getQueue(id);
    }

    
}
