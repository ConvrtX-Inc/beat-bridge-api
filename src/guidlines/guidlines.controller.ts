import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request, Body, Param, Patch } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CrudController } from "@nestjsx/crud";
import { Guidlines } from "./guidlines.entity";
import { GuidlinesService } from "./guidlines.service";
import { CreateGuidlinesDto } from "./dtos/create-guidlines.dto";


// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@ApiTags('Guidlines')
@Controller({path : "guidlines" , version : "1"})
export class GuidlinesController implements CrudController<Guidlines>{
    constructor(public service : GuidlinesService){}
    get base(): CrudController<Guidlines>{
        return this;
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createOneGuidline(@Request() req ,@Body() dto:CreateGuidlinesDto ){
        return await this.service.createOneGuidline(req.user.id , dto);
    }

    @Get(':type')
    @HttpCode(HttpStatus.OK)
    async getByType(@Param('type') type){
        return this.service.getByType(type);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async updateGuidline( @Param('id')id, @Body() dto:CreateGuidlinesDto){
       return await this.service.updateGuidline(id,dto);
    }
}