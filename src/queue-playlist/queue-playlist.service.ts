import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueuePlaylist } from './queue-playlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../utils/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';

@Injectable()
export class QueuePlaylistService extends TypeOrmCrudService<QueuePlaylist> {
  constructor(
    @InjectRepository(QueuePlaylist)
    private queuePlaylistsRepository: Repository<QueuePlaylist>,
  ) {
    super(queuePlaylistsRepository);
  }

  /*
   * find one entity
   */
  async findOneEntity(options: FindOptions<QueuePlaylist>) {
    return this.queuePlaylistsRepository.findOne({
      where: options.where,
    });
  }

  /*
   * find many entity
   */
  async findManyEntities(options: FindOptions<QueuePlaylist>) {
    return this.queuePlaylistsRepository.find({
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
  async saveEntity(data: DeepPartial<QueuePlaylist>[]) {
    return this.queuePlaylistsRepository.save(
      this.queuePlaylistsRepository.create(data),
    );
  }

  /*
   * Softdelete single entity
   */
  async softDelete(id: number): Promise<void> {
    await this.queuePlaylistsRepository.softDelete(id);
  }

  /*
   * Hardelete single entity
   */
  async delete(id: number): Promise<void> {
    await this.queuePlaylistsRepository.delete(id);
  }
}
