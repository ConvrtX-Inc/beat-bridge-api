import { Injectable, NotFoundException } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Guidlines, GuidlinesTypesEnum } from "./guidlines.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGuidlinesDto } from "./dtos/create-guidlines.dto";
import { DeepPartial } from "src/utils/types/deep-partial.type";
import { CreateRateBasedRuleRequest } from "aws-sdk/clients/waf";


@Injectable()
export class GuidlinesService extends TypeOrmCrudService<Guidlines>{
    constructor(
        @InjectRepository(Guidlines)
        private guidlinesRepository: Repository<Guidlines>,
    ) {
        super(guidlinesRepository);
    }

    /*
     * save entity
     */
    async saveEntity(data: DeepPartial<Guidlines>[]) {
        return this.guidlinesRepository.save(
            this.guidlinesRepository.create(data),
        );
    }

    /*
     * save single entity
     */
    async saveOne(data) {
        return await this.saveEntity(data);
    }

    /*
     * Create One Guidline
     */
    async createOneGuidline(id: string, dto: CreateGuidlinesDto) {
        dto['user_id'] = id;
        return await this.saveOne(dto);
    }

    /*
     * GET Guidline By Type
     */
    async getByType(type: string) {

        if (type == GuidlinesTypesEnum.PRIVACY_POLICY || type == GuidlinesTypesEnum.TERM_CONDITION) {
            return await this.guidlinesRepository.findOne({
                where: {
                    type: type
                }
            })            
        } 
        else if(type == GuidlinesTypesEnum.FAQ){
            return await this.guidlinesRepository.find({
                where:{
                    type: GuidlinesTypesEnum.FAQ
                }
            })
        }

    }

    /*
     * Update Guiline by id
     */
    async updateGuidline(id:string , dto: CreateGuidlinesDto){
        const guidline = await this.guidlinesRepository.findOne({
            where : {
                id : id
            }
        })
        if(!guidline){
            throw new NotFoundException({
                guidline : "No Guiline Found"
            })        
        }
       
        guidline.type = dto.type ;
        guidline.description = dto.description,
        guidline.questions = dto.description
        return await guidline.save();
    }
}