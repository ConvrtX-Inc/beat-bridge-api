import { Injectable,HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TrackHistory } from "./track-history.entity";

@Injectable()

export class TrackHistoryService extends TypeOrmCrudService<TrackHistory>{

    constructor(
        @InjectRepository(TrackHistory)
        private destinationRepository : Repository<TrackHistory>
    ){
        super(destinationRepository);
    }

}