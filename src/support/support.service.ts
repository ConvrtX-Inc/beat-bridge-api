import { Injectable,HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SysSupport } from './support.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../utils/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { UpdateStatusDto } from './dto/status-update.dto';
import { CrudRequest } from '@nestjsx/crud';


@Injectable()
export class SysSupportService extends TypeOrmCrudService<SysSupport>{

    constructor(
        @InjectRepository(SysSupport)
         private destinationsRepository: Repository<SysSupport>,
    ){
        super(destinationsRepository);
    }
 /*
  * find one entity
  */
  async findOneEntity(options: FindOptions<SysSupport>) {
    return this.destinationsRepository.findOne({
      where: options.where,
    });
  }

  /*
   * find many entity
   */
  async findManyEntities(options: FindOptions<SysSupport>) {
    return this.destinationsRepository.find({
      where: options.where,
    });
  }

  /*
   * save single entity
   */
  async saveOne(data) {
    return await this.saveEntity(data);
  }

  /*
   * save entity
   */
  async saveEntity(data: DeepPartial<SysSupport>[]) {
    return this.destinationsRepository.save(
      this.destinationsRepository.create(data),
    );
  }


  // Updates ticket status
  async updateStatus(req:CrudRequest,dto:UpdateStatusDto){
      const support = await this.findOne(
        {
          where:{id:dto.id}
        }
      )
      if(!support)
      {
        return {
          status : HttpStatus.BAD_REQUEST,
          sent_data: dto,
          response:{
            message:'Ticket not found'
          }
        }
      }
      else
      {
        support.status_id = dto.status;
        support.save();
        return support;
      }
  }

  /*
   * Softdelete single entity
   */
  async softDelete(id: number): Promise<void> {
    await this.destinationsRepository.softDelete(id);
  }

  /*
   * Hardelete single entity
   */
  async delete(id: number): Promise<void> {
    await this.destinationsRepository.delete(id);
  }
}
