import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserQueue } from './user-queue.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../utils/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { UpdateUserQueueImageDto } from './dto/update-user-queue-image.dto';
import { CrudRequest } from '@nestjsx/crud';

@Injectable()
export class UserQueueService extends TypeOrmCrudService<UserQueue> {
  constructor(
    @InjectRepository(UserQueue)
    private destinationsRepository: Repository<UserQueue>,
  ) {
    super(destinationsRepository);
  }

  /*
   * find one entity
   */
  async findOneEntity(options: FindOptions<UserQueue>) {
    return this.destinationsRepository.findOne({
      where: options.where,
    });
  }

  /*
   * find many entity
   */
  async findManyEntities(options: FindOptions<UserQueue>) {
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
  async saveEntity(data: DeepPartial<UserQueue>[]) {
    return this.destinationsRepository.save(
      this.destinationsRepository.create(data),
    );
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

  // Updates ticket status
  async updateImage(userId:String,dto:UpdateUserQueueImageDto){
    
    console.log("USERID:"+userId);
    const queue = await this.findOne(
      {
        where:{
          id:dto.id,
          user_id:userId
        }
      }
    );

    if(queue)
    {
      if(dto.image)
      {
        queue.image = dto.image
        return queue.save();
      }
      else
      {
        return {
          status : HttpStatus.BAD_REQUEST,
          response:{
            message:'No image was set'
          }
        }
      }
     
    }
    else
    {
      return {
          status : HttpStatus.BAD_REQUEST,
          response:{
            message:'Queue not found'
          }
      }
    }
      // const support = await this.findOne(
      //   {
      //     where:{id:dto.id}
      //   }
      // )
      // if(!support)
      // {
      //   return {
      //     status : HttpStatus.BAD_REQUEST,
      //     sent_data: dto,
      //     response:{
      //       message:'Ticket not found'
      //     }
      //   }
      // }
      // else
      // {
      //   support.status_id = dto.status;
      //   support.save();
      //   return support;
      // }
  }
}
