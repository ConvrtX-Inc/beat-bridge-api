import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueueMember } from './queue-member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../utils/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { QueueMembersBatchDto } from './dto/queue-members-batch.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'aws-sdk/clients/appstream';
import { identity } from 'rxjs';
import { throws } from 'assert';

@Injectable()
export class QueueMemberService extends TypeOrmCrudService<QueueMember> {
  constructor(
    @InjectRepository(QueueMember)
    private destinationsRepository: Repository<QueueMember>,
    private usersService: UsersService  ) {
    super(destinationsRepository);
  }

  /*
   * Create One entity
   */
  async createOneMember(data:any){
    const newMember = this.destinationsRepository.save(data);
    return newMember;
  }
  /*
   * Update One entity
   */
  async updateMember(id,memberData){
    const member = await this.destinationsRepository.findOne({
      id:id
    })
    member.is_admin = memberData.is_admin;
    await member.save()
    return member;
  }

  /*
   * find one entity
   */
  async findOneEntity(options: FindOptions<QueueMember>) {
    return this.destinationsRepository.findOne({
      where: options.where,
    });
  }

  /*
   * find many entity
   */
  async findManyEntities(options: FindOptions<QueueMember>) {
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
  async saveEntity(data: DeepPartial<QueueMember>[]) {
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
  async delete(id: string): Promise<void> {
    await this.destinationsRepository.delete(id);
  }

  async removeMember(queue_id , user){
    const member = await this.destinationsRepository.findOne({
      where : {
        user_id : user.id,
        user_queue_id : queue_id
      }
    });   
    if(!member){
      return{
        message : "No Member Found",
        status : HttpStatus.BAD_GATEWAY        
      }
    }
    await this.delete(member.id)
    return { message : "Member Deleted Successfully"}
   
  }

  async getAll(queueId:any){

    var queueMembers = await this.destinationsRepository.find({
      user_queue_id:queueId
    })

    return queueMembers;
  }

  async addAll(u:User,dto:QueueMembersBatchDto){

    var result=[];
    for(const i in dto.users){

        var user =  await this.usersService.findOne({where:{id:dto.users[i]}});
        if(user){
          var queueMember = new QueueMember();
          queueMember.is_admin=false;
          queueMember.user_id = user.id;
          queueMember.user_queue_id = dto.queueId;
          result[i]=await queueMember.save();

        }      
        
    }
    return result;
    
  }



}
