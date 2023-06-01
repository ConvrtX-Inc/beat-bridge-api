import { Module } from "@nestjs/common";
import { GuidlinesController } from "./guidlines.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Guidlines } from "./guidlines.entity";
import { GuidlinesService } from "./guidlines.service";


@Module({
    controllers: [GuidlinesController],
    imports : [TypeOrmModule.forFeature([Guidlines])],
    providers: [GuidlinesService],
})
export class GuidlinesModule {}