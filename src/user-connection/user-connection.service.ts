import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserConnection } from './user-connection.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { UsersService } from 'src/users/users.service';
import { SendFriendRequestDto } from './dtos/send-friend-request.dto';
import { User } from '../users/user.entity';
import { AddFriendDto } from './dtos/add-friend-request.dto';
import { resourceLimits } from 'worker_threads';

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
   * send friend by user id
   */
  async addFriendRequest(user: User, dto: AddFriendDto,) {
    
    //Checks if sent to self
    if(user.id === dto.id)
    {
        return {
          status : HttpStatus.BAD_REQUEST,
          response:{
            dto:dto,
            code:'cannotSendRequestToSelf',
            message:'You cannot send yourself a request'
          }
        };
    }

    //Checks if current user has an existing connection request
    const requested = await this.isRequested(user.id,dto.id) 
    if(requested)
    {
       
      return {
          status : HttpStatus.BAD_REQUEST,
          response:{
            dto:dto,
            code:'requestExists',
            message:'You already sent a friend request'
          }
        };
    }
    else
    {
      //checks if receiver has already sent the current user a friend request
      const pending = await this.isRequested(dto.id,user.id) 
      if(pending)
      {
      
        return {
          status : HttpStatus.BAD_REQUEST,
          response:{
            dto:dto,
            code:'requestExistsFromUser',
            message:'Sent you a friend request'
          }
        };
      }
      else
      {
        const data = {
          to_user_id: dto.id,
          from_user_id: user.id,
        };
        return await this.saveOne(data);
      }
     
    }
  }

  /*
    Checks if request has already been sent
  */
 async isRequested(fromId:String,toId:String)
  {
    return await this.findOne({
      
      where:{
          to_user_id:toId,
          from_user_id:fromId
      }
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

  async getClosesUsers(latitude: string, longitude: string, user: User) {
    const fromUserId = user.id;
    const query = this.userConnectionRepository.createQueryBuilder('uc');
    const friends = await query
      .innerJoin('user', 'u', 'u.id::text = uc.to_user_id::text')
      .select([
        'uc.is_accepted as has_accepted',
        'u.username as username',
        'u.email as email',
        'u.phone_no as phone_no',
        'u.latitude as latitude',
        'u.longitude as longitude',
      ])
      .where("uc.from_user_id::text = '" + fromUserId + "'")
      .getRawMany();

    const results = [];
    for (let i = 0; i < friends.length; i++) {
      if (!Number.isNaN(parseFloat(friends[i]['latitude']))) {
        if (
          this.closestLocation(
            parseFloat(latitude),
            parseFloat(longitude),
            parseFloat(friends[i]['latitude']),
            parseFloat(friends[i]['longitude']),
            'K',
          ) <= 1
        ) {
          results.push(friends[i]);
        }
      }
    }
    return {
      status: HttpStatus.OK,
      response: {
        data: {
          details: results,
        },
      },
    };
  }

  closestLocation(lat1, lon1, lat2, lon2, unit) {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let distance =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (distance > 1) {
      distance = 1;
    }
    distance = Math.acos(distance);
    distance = (distance * 180) / Math.PI;
    distance = distance * 60 * 1.1515;
    if (unit == 'K') {
      distance = distance * 1.609344;
    }
    if (unit == 'N') {
      distance = distance * 0.8684;
    }
    return distance;
  }
}
