import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserConnection } from './user-connection.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { UsersService } from 'src/users/users.service';
import { SendFriendRequestDto } from './dtos/send-friend-request.dto';
import { User } from '../users/user.entity';
import { AddFriendDto, CheckFriendDto } from './dtos/add-friend-request.dto';
import { resourceLimits } from 'worker_threads';
import { ConfirmDto } from './dtos/confirm-request.dto';

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
    if (user.id === dto.id) {
      return {
        status: HttpStatus.BAD_REQUEST,
        response: {
          dto: dto,
          code: 'cannotSendRequestToSelf',
          message: 'You cannot send yourself a request'
        }
      };
    }

    //Checks if current user has an existing connection request
    const requested = await this.isRequested(user.id, dto.id)
    if (requested) {

      return {
        status: HttpStatus.BAD_REQUEST,
        response: {
          dto: dto,
          code: 'requestExists',
          message: 'You already sent a friend request'
        }
      };
    }
    else {
      //checks if receiver has already sent the current user a friend request
      const pending = await this.isRequested(dto.id, user.id)
      if (pending) {

        return {
          status: HttpStatus.BAD_REQUEST,
          response: {
            dto: dto,
            code: 'requestExistsFromUser',
            message: 'Sent you a friend request'
          }
        };
      }
      else {
        const data = {
          to_user_id: dto.id,
          from_user_id: user.id,
          is_accepted: true,
        };
        const saved = await this.userConnectionRepository.save(
          this.userConnectionRepository.create(data));


        const saved2 = {
          from_user_id: dto.id,
          to_user_id: user.id,
          parent_id: saved.id,
        };

        await this.saveOne(saved2);
        return saved;
      }

    }
  }



  async confirm(user: User, dto: ConfirmDto) {

    var requested: UserConnection = await this.userConnectionRepository.findOne({
      where: {
        to_user_id: user.id,
        from_user_id: dto.id
      }
    })
    if (requested) {

      if (requested.is_accepted) {
        return {
          status: HttpStatus.BAD_REQUEST,
          response: {
            dto: dto,
            code: 'alreadyConfirmed',
            message: 'Request Already Confirmed'
          }
        };
      }

      requested.is_accepted = true;
      const childFriend = await this.userConnectionRepository.findOne({
        where: { parent_id: requested.id }
      });
      if (childFriend) {
        childFriend.is_accepted = true;
        await childFriend.save();
      }
      return await requested.save();

    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        response: {
          dto: dto,
          code: 'noRequst',
          message: 'Connection Request Not Found'
        }
      };
    }

  }


  /*
    Checks if request has already been sent
  */
  async isRequested(fromId: String, toId: String) {
    return await this.findOne({

      where: {
        to_user_id: toId,
        from_user_id: fromId
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
    if (req) {

      if (req.id == user.id) {
        return {
          response: {
            message: "Cannot send request to yourself",
            code: "cannotSendRequestToSelf",
            dto: sendFriendRequestDto
          },
          status: HttpStatus.BAD_REQUEST
        }
      }

      const sentRequest = await this.userConnectionRepository.findOne({
        where: {
          to_user_id: req.id,
          from_user_id: user.id
        }

      });
      if (sentRequest) {

        return {
          response: {
            message: "Already sent a request",
            code: "requestExists",
            dto: sendFriendRequestDto
          },
          status: HttpStatus.BAD_REQUEST
        };

      }

      const receievedRequest = await this.userConnectionRepository.findOne({
        where: {
          from_user_id: req.id,
          to_user_id: user.id
        }
      });
      if (receievedRequest) {
        return {
          response: {
            message: "Already received a request",
            code: "requestExistsFromUser",
            dto: sendFriendRequestDto
          },
          status: HttpStatus.BAD_REQUEST
        };

      }
      const data = {
        from_user_id: user.id,
        to_user_id: req.id,
      };

      const saved = await this.userConnectionRepository.save(
        this.userConnectionRepository.create(data));

      const saved2 = {
        from_user_id: req.id,
        to_user_id: user.id,
        parent_id: saved.id,
      };
      await this.saveOne(saved2);
      return saved;
    }

    return {
      message: "User not found",
      statusCode: HttpStatus.BAD_REQUEST
    }

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

  async deleteFriend(id: string): Promise<void> {
    await this.userConnectionRepository.softDelete(id);
  }



  async getCloseUsersForRequest(latitude: string, longitude: string, user: User) {
    const users = await this.usersService.find();
    const results = [];
    console.log("Found a users:" + users.length);
    for (let i = 0; i < users.length; i++) {

      if (users[i].id != user.id) {
        if (user && !Number.isNaN(parseFloat(users[i].latitude))) {
          if (
            this.closestLocation(
              parseFloat(latitude),
              parseFloat(longitude),
              parseFloat(users[i].latitude),
              parseFloat(users[i].longitude),
              'K',
            ) <= 1
          ) {

            console.log("Found a user:" + JSON.stringify(user));
            var uc = await this.userConnectionRepository.findOne({
              where: [
                { to_user_id: user.id, from_user_id: users[i].id },
                { from_user_id: user.id, to_user_id: users[i].id }
              ]
            });

            results.push({
              user: users[i],
              connection: uc
            });
          }
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




  async getPendingRequests(user: User) {
    const query = await this.userConnectionRepository.find({
      where: [
        { to_user_id: user.id, is_accepted: false },
        { from_user_id: user.id, is_accepted: false }
      ]

    });


    var friends = [];

    for (const i in query) {

      console.log("1Get FRIENDS:" + query[i].from_user_id);
      console.log("2Get FRIENDS:" + query[i].to_user_id);
      var u = await this.usersService.findOne({
        where: {
          id: query[i].from_user_id == user.id ? query[i].to_user_id : query[i].from_user_id
        }
      });
      friends[i] = {
        user: u,
        connection: query[i]
      };

    }

    return {
      friends: friends
    }

  }

  async getFriends(user: User) {
    console.log("Getting friends for :" + user.id);
    const query = await this.userConnectionRepository.find({
      where: { to_user_id: user.id, is_accepted: true },
    });
    return query;

    //   var friends=[];

    // for(const i in query){

    //   console.log("1Get FRIENDS:"+query[i].from_user_id);
    //   console.log("2Get FRIENDS:"+query[i].to_user_id);
    //   var u = await this.usersService.findOne({
    //     where:{
    //       id : query[i].from_user_id == user.id?query[i].to_user_id:query[i].from_user_id 
    //     }
    //   });    
    //   friends[i] = u;

    // }

    //  return {
    //   friends:friends
    //  }

  }




  async deleteMyFriend(id: string) {
    const childFriend = await this.userConnectionRepository.findOne({
      where: { parent_id: id },
    });
    const deletedfriend = await this.userConnectionRepository.delete(id)

    if (childFriend) {
      await this.userConnectionRepository.delete(childFriend.id);
    }

    if (deletedfriend.affected == 0) {
      return {
        error: [
          { message: "No Friend Found" }
        ]
      }
    }
    return {
      message: "Friend Deleted Successfully"
    }
  }
  async getSentRequests(user: User) {
    const query = await this.userConnectionRepository.find({
      where: [
        { from_user_id: user.id, is_accepted: false }
      ]

    });


    var friends = [];

    for (const i in query) {

      console.log("1Get FRIENDS:" + query[i].from_user_id);
      console.log("2Get FRIENDS:" + query[i].to_user_id);
      var u = await this.usersService.findOne({
        where: {
          id: query[i].from_user_id == user.id ? query[i].to_user_id : query[i].from_user_id
        }
      });
      friends[i] = {
        user: u,
        connection: query[i]
      };

    }

    return {
      friends: friends
    }

  }

  async getReceivedRequests(user: User) {
    const query = await this.userConnectionRepository.find({
      where: [
        { to_user_id: user.id, is_accepted: false, parent_id: null }
      ]

    });

    var friends = [];
    var retunArr = [];

    for (const i in query) {

      console.log("1Get FRIENDS:" + query[i].from_user_id);
      console.log("2Get FRIENDS:" + query[i].to_user_id);
      var u = await this.usersService.findOne({
        where: {
          id: query[i].from_user_id == user.id ? query[i].to_user_id : query[i].from_user_id
        }
      });
      // friends[i] = { 
      //   user:u,
      //   connection:query[i]
      // };
      retunArr[i] = u;
      retunArr[i]['connection'] = query[i];
    }
    return retunArr;
    //  return {
    //   friends:friends
    //  }

  }

  /*
   * To Test the User is Our Friend or Not
   */
  async checkFriend(id: string, dto: CheckFriendDto) {
    const sentRequest = await this.userConnectionRepository.findOne({
      where: {
        to_user_id: id,
        from_user_id: dto.friend_id,
        is_accepted: false
      }

    });
    if (sentRequest) {

      return {
        response: {
          message: "Already sent a request",
          code: "requestExists",
        },
      };

    }

    const receievedRequest = await this.userConnectionRepository.findOne({
      where: {
        from_user_id: id,
        to_user_id: dto.friend_id,
        is_accepted: false
      }
    });
    if (receievedRequest) {
      return {
        response: {
          message: "Already received a request",
          code: "requestExistsFromUser",
        },
      };
    }

    const alreadyFriend = await this.userConnectionRepository.findOne({
      where: [
        {
          from_user_id: dto.friend_id,
          to_user_id: id,
          is_accepted: true,
        },
        {
          from_user_id: id,
          to_user_id: dto.friend_id,
          is_accepted: true,
        }
      ]
    });
    if(alreadyFriend){
      return {
        response: {
          message: "Already Friend",
          code: "friendExistsWithUser",
        },
      };
    }
    return {
      response: {
        message: "Not Friend with this User_id",
        code: "youAreNotFriendWithThisUser",
      },    
    };
  }
}
