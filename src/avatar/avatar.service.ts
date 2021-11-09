import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../utils/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { Avatar } from './avatar.entity';

@Injectable()
export class AvatarService extends TypeOrmCrudService<Avatar> {
  constructor(
    @InjectRepository(Avatar)
    private usersRepository: Repository<Avatar>,
  ) {
    super(usersRepository);
  }

  async findOneEntity(options: FindOptions<Avatar>) {
    return this.usersRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<Avatar>) {
    return this.usersRepository.find({
      where: options.where,
    });
  }

  async saveEntity(data: DeepPartial<Avatar>) {
    return this.usersRepository.save(this.usersRepository.create(data));
  }
}
