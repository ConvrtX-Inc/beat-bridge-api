import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueuePlaylist } from './queue-playlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../utils/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { SourcePlatformDto } from './dtos/source-platform.dto';
import { QueueCreatorDto } from './dtos/queue-creator.dto';
import { QueueNearMeDto } from './dtos/queue-near-me.dto';
import { QueueCreatedDateDto } from './dtos/queue-created-date.dto';
import { QueueNameDto } from './dtos/queue-name.dto';

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

  async getSourcePlatform(dto: SourcePlatformDto) {
    const query =
      this.queuePlaylistsRepository.createQueryBuilder('queue_playlist');
    query
      .leftJoin(
        'user_queue',
        'uq',
        'uq.id::text = queue_playlist.user_queue_id::text',
      )
      .select([
        'queue_playlist.id as id',
        'queue_playlist.item_metadata as medata',
        'queue_playlist.item_link as item_link',
        'uq.name as name',
      ])
      .where('queue_playlist.item_link  like %' + dto.source + '%' + '');
    return await query.getRawMany();
  }

  async getQueueCreator(dto: QueueCreatorDto) {
    const query =
      this.queuePlaylistsRepository.createQueryBuilder('queue_playlist');
    query
      .leftJoin(
        'user_queue',
        'uq',
        'uq.id::text = queue_playlist.user_queue_id::text',
      )
      .select([
        'queue_playlist.id as id',
        'queue_playlist.item_metadata as medata',
        'queue_playlist.item_link as item_link',
        'uq.name as name',
      ])
      .where(
        'queue_playlist.item_metadata  like %' + dto.creator_id + '%' + '',
      );
    return await query.getRawMany();
  }

  async getQueueNearMe(dto: QueueNearMeDto) {
    const query =
      this.queuePlaylistsRepository.createQueryBuilder('queue_playlist');
    query
      .leftJoin(
        'user_queue',
        'uq',
        'uq.id::text = queue_playlist.user_queue_id::text',
      )
      .select([
        'queue_playlist.id as id',
        'queue_playlist.item_metadata as medata',
        'queue_playlist.item_link as item_link',
        'uq.name as name',
      ])
      .where('queue_playlist.item_metadata  like %' + dto.location + '%' + '');
    return await query.getRawMany();
  }

  async getQueueCreatedDate(dto: QueueCreatedDateDto) {
    const query =
      this.queuePlaylistsRepository.createQueryBuilder('queue_playlist');
    query
      .leftJoin(
        'user_queue',
        'uq',
        'uq.id::text = queue_playlist.user_queue_id::text',
      )
      .select([
        'queue_playlist.id as id',
        'queue_playlist.item_metadata as medata',
        'queue_playlist.item_link as item_link',
        'uq.name as name',
      ])
      .where(
        'queue_playlist.created_date::timestamp::date  like %' +
          dto.date +
          '%' +
          '',
      );
    return await query.getRawMany();
  }

  async getQueueName(dto: QueueNameDto) {
    const query =
      this.queuePlaylistsRepository.createQueryBuilder('queue_playlist');
    query
      .leftJoin(
        'user_queue',
        'uq',
        'uq.id::text = queue_playlist.user_queue_id::text',
      )
      .select([
        'queue_playlist.id as id',
        'queue_playlist.item_metadata as medata',
        'queue_playlist.item_link as item_link',
        'uq.name as name',
      ])
      .where('queue_playlist.item_metadata  like %' + dto.name + '%' + '');
    return await query.getRawMany();
  }
}
