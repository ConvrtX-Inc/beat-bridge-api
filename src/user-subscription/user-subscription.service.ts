import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../utils/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { UserSubscription } from './user-subscription.entity';
import { RenewSubscriptionDto } from './dtos/renew-subscription.dto';

@Injectable()
export class UserSubscriptionService extends TypeOrmCrudService<UserSubscription> {
  constructor(
    @InjectRepository(UserSubscription)
    private usersRepository: Repository<UserSubscription>,
  ) {
    super(usersRepository);
  }

  async findOneEntity(options: FindOptions<UserSubscription>) {
    return this.usersRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<UserSubscription>) {
    return this.usersRepository.find({
      where: options.where,
    });
  }

  async saveEntity(data: DeepPartial<UserSubscription>) {
    return this.usersRepository.save(this.usersRepository.create(data));
  }

  async renewSubscription(dto: RenewSubscriptionDto) {
    const userSubs = await this.usersRepository.findOne({
      user_id: dto.user_id,
      code: dto.code,
    });
    userSubs.start_date = dto.start_date;
    userSubs.end_date = dto.end_date;
    await userSubs.save();
  }

 async isExpiring(user_id: string, code: string) {
   const querySubscription = this.usersRepository.createQueryBuilder("subscription");
   querySubscription.select("*");    
   querySubscription.where("subscription.end_date BETWEEN NOW() - INTERVAL '7 DAY' and NOW() ");
   querySubscription.andWhere('subscription.user_id = :user_id', { user_id: user_id });   
   querySubscription.andWhere('subscription.code = :code', { code: code });   
   return querySubscription.getRawOne();
  }   
}

