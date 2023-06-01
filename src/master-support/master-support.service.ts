import { Injectable,HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { MasterSupport } from "./master-support.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()

export class MasterSupportService extends TypeOrmCrudService<MasterSupport>{

    constructor(
        @InjectRepository(MasterSupport)
        private destinationRepository : Repository<MasterSupport>
    ){
        super(destinationRepository);
    }

}