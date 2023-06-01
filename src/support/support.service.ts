import { Injectable, HttpStatus, Query } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SupportStatusEnum, SysSupport } from './support.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../utils/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { query } from 'express';


@Injectable()
export class SysSupportService extends TypeOrmCrudService<SysSupport>{

  constructor(
    @InjectRepository(SysSupport)
    private destinationsRepository: Repository<SysSupport>,
  ) {
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

  async getManySupport(limit: number) {
    return await this.destinationsRepository.find({
      take: limit || 1000,
    });
  }

  async changeStatusToCompleted(id) {
    const ticket = await this.destinationsRepository.findOne({
      where: { id: id }
    });
    console.log(ticket);
    if (ticket) {
      ticket.status = SupportStatusEnum.APPROVED
      const save = await ticket.save();
      return save;
    }
    return { message: "No Ticket Found" };
  }
}
