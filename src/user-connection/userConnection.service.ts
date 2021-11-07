import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserConnection } from './userConnection.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../utils/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { UsersService } from 'src/users/users.service';
import { SendFriendRequestDto } from './dtos/send-friend-request.dto';
import { User } from '../users/user.entity';

@Injectable()
export class UserConnectionService extends TypeOrmCrudService<UserConnection> {
  constructor(
    @InjectRepository(UserConnection)
    private userConnectionRepository: Repository<UserConnection>,
    private usersService: UsersService,
  ) {
    super(userConnectionRepository);
  }

  /*
   * find one entity
   */
  async findOneEntity(options: FindOptions<UserConnection>) {
    return this.userConnectionRepository.findOne({
      where: options.where,
    });
  }

  /*
   * find many entity
   */
  async findManyEntities(options: FindOptions<UserConnection>) {
    return this.userConnectionRepository.find({
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
  async saveEntity(data: DeepPartial<UserConnection>[]) {
    return this.userConnectionRepository.save(
      this.userConnectionRepository.create(data),
    );
  }

  /*
   * Softdelete single entity
   */
  async softDelete(id: string): Promise<void> {
    await this.userConnectionRepository.softDelete(id);
  }

  /*
   * Hardelete single entity
   */
  async delete(id: string): Promise<void> {
    await this.userConnectionRepository.delete(id);
  }

  /*
   * fetch all friend request
   */
  fetchAllRequest(user: User) {
    const fromUserId = user.id;
    return this.userConnectionRepository.find({
      where: { from_user_id: fromUserId },
    });
  }

  /*
   * send friend request by email
   */
  async sendFriendRequestByEmail(
    user: User,
    sendFriendRequestDto: SendFriendRequestDto,
  ) {
    const req = await this.usersService.findOneEntity({
      where: {
        email: sendFriendRequestDto.email,
      },
    });
    const data = {
      to_user_id: req.id,
      from_user_id: user.id,
    };
    return await this.saveOne(data);
  }
}
