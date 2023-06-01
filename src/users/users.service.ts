import { All, ConsoleLogger, HttpStatus, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
import { FindOptions } from 'src/utils/types/find-options.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { UpdateUserDto } from './dtos/update-user.dto';
import { MailService } from 'src/mail/mail.service';
import * as crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { UserUpdateRequest } from '../user_update_request/user_update_request.entity';
import { UserSubscription } from '../user-subscription/user-subscription.entity';
import { UserQueue } from '../user-queue/user-queue.entity';
import { Track } from '../track/track.entity';
import { UserConnection } from 'src/user-connection/user-connection.entity';
import { ConnectAppContext } from 'twilio/lib/rest/api/v2010/account/connectApp';


@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailService: MailService,
  ) {
    super(usersRepository);
  }

  async findOneEntity(options: FindOptions<User>) {
    return this.usersRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<User>) {
    return this.usersRepository.find({
      where: options.where,
    });
  }

  // TO find the Total Users and Total Playlist in single End Point
  async findTotalCount() {
    const users = await this.usersRepository.count();
    const userQueue = await UserQueue.count({});
    const userSubscriptions = await UserSubscription.count({});
    const Tracks = await Track.count({});

    const start = new Date();
    // Set Privios Date to Perious 30 Days  
    const predate = start.getDate() - 15;
    start.setDate(predate);
    const end = new Date();

    // Get User STATS
    const userQuery = this.usersRepository.createQueryBuilder('u');
    const usersStats = await userQuery
      .select([
        "EXTRACT(DAY FROM u.created_date) as date",
        'COUNT(EXTRACT(DAY FROM u.created_date))::int as count',
      ])
      .where(`u.created_date BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'`)
      .orderBy('date', 'DESC')
      .groupBy(`date`)
      .limit(4)
      .getRawMany();
    console.log(usersStats);
    // Get Track STATS
    const trackQuery = Track.createQueryBuilder('t');
    const tracksStats = await trackQuery
      .select([
        "EXTRACT(DAY FROM t.created_date) as date",
        'COUNT(EXTRACT(DAY FROM t.created_date))::int as count',
      ])
      .where(`t.created_date BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'`)
      .orderBy('date', 'DESC')
      .groupBy('date')
      .limit(4)
      .getRawMany();

    // Get Playlist STATS
    const playlistQuery = UserQueue.createQueryBuilder('p');
    const playlistStats = await playlistQuery
      .select([
        "EXTRACT(DAY FROM p.created_date) as date",
        'COUNT(EXTRACT(DAY FROM p.created_date))::int as count',
      ])
      .where(`p.created_date BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'`)
      .orderBy('date', 'DESC')
      .groupBy('date')
      .limit(4)
      .getRawMany();

    // console.log(playlistStats);

    return {
      userCount: users,
      user_stats: usersStats,
      tracksCount: Tracks,
      tracks_stats: tracksStats,
      queueCount: userQueue,
      playlist_stats: playlistStats,
      subscriptionCount: userSubscriptions,
    };
  }

  async getAll(limit: number, req) {
    var updatedUser = [];
    const all = await this.usersRepository.find({
      take: limit || 50,
      where: { id: Not(req.id) },
      order: {
        created_date: "DESC" // "ASC"
      }
    });

    for (let i = 0; i < all.length; i++) {
      const trackCount = await Track.count({
        user_id: all[i].id
      })
      all[i]['track_count'] = trackCount;
      updatedUser.push(all[i]);
    }
    return updatedUser;
  }

  async getOneBase(id: string) {
    const results = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
    return {
      status: HttpStatus.OK,
      response: {
        data: {
          details: results ?? [],
        },
      },
    };
  }

  async saveEntity(data: DeepPartial<User>) {
    return this.usersRepository.save(this.usersRepository.create(data));
  }

  async softDelete(id: string): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
  async getClosestUsers(latitude: string, longitude: string, user: User) {
    const query = this.usersRepository.createQueryBuilder('u');
    const users = await query
      .select([
        'u.id as id',
        'u.username as username',
        'u.email as email',
        'u.phone_no as phone_no',
        'u.latitude as latitude',
        'u.longitude as longitude',
        'u.image as image'
      ])
      .where("u.id::text <> '" + user.id + "'")
      .getRawMany();        
    const results = [];
    for (let i = 0; i < users.length; i++) {

      const use = await UserConnection.findOne({
        where : {
          to_user_id : user.id,
          from_user_id : users[i].id
        }
      })                
      const totalTracks = await Track.count({
        where: { user_id: users[i].id }
      })
      users[i]['total_track'] = totalTracks;       
      if (!use && !Number.isNaN(parseFloat(users[i]['latitude']))) {        
        if (
          this.closestLocation(
            parseFloat(latitude),
            parseFloat(longitude),
            parseFloat(users[i]['latitude']),
            parseFloat(users[i]['longitude']),
            'K',
          ) <= 50
        ) {          
          // console.log(users[i].username);
          results.push(users[i]);
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
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // in metres
    const km = Math.round(d/1000);  
    // console.log(km);
    return km; 
  }

  async updateUser(dto: UpdateUserDto, id) {
    // let hasDuplicateBoth = false;
    // let hasDuplicateEmail = false;
    // let hasDuplicateUsername = false;
    // let message = 'Successfully updated';
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });    
    if (!user) {
      return {
        status: HttpStatus.BAD_REQUEST,
        sent_data: dto,
        response: {
          message: 'User not found',
        },
      };
    }

    try {
      user.password = dto.password;
      user.username = dto.username;
      user.email = dto.email;
      user.phone_no = dto.phone_number;
      await user.save();
      return {
        status: HttpStatus.OK,
        response: {
          message: 'Successfully Updated',
        },
      }
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        response: {
          message: 'Something went wrong',
        },
      };
    }
    // const query = this.usersRepository.createQueryBuilder('u');
    // const checkUserEmail = await query
    //   .select(['u.id'])
    //   .where(
    //     "(u.id::text <> '" + id + "' AND u.email::text = '" + dto.email + "')",
    //   )
    //   .getRawMany();

    // const checkUserName = await query
    //   .select(['u.id'])
    //   .where(
    //     "(u.id::text <> '" +
    //     id +
    //     "' AND u.username::text = '" +
    //     dto.username +
    //     "')",
    //   )
    //   .getRawMany();
    // hasDuplicateEmail = !!(checkUserEmail && checkUserEmail.length);
    // hasDuplicateUsername = !!(checkUserName && checkUserName.length);
    // hasDuplicateBoth = !!(hasDuplicateEmail && hasDuplicateUsername);
    // if (hasDuplicateEmail) {
    //   message = 'Duplicate email.';
    // }
    // if (hasDuplicateUsername) {
    //   message = 'Duplicate username.';
    // }
    // if (hasDuplicateBoth) {
    //   message = 'Duplicate username and email.';
    // }
    // if (hasDuplicateEmail || hasDuplicateUsername || hasDuplicateBoth) {
    //   return {
    //     status: HttpStatus.BAD_REQUEST,
    //     sent_data: dto,
    //     response: {
    //       message: message,
    //     },
    //   };
    // }
    // const hash = crypto
    //   .createHash('sha256')
    //   .update(randomStringGenerator())
    //   .digest('hex');
    // await this.mailService.updateProfile({
    //   to: user.email,
    //   name: user.username,
    //   data: {
    //     hash,
    //   },
    // });

    // const userUpdateRequest = new UserUpdateRequest();
    // userUpdateRequest.user_id = user.id;
    // userUpdateRequest.hash = hash;
    // userUpdateRequest.username = dto.username;
    // userUpdateRequest.email = dto.email;
    // userUpdateRequest.phone_no = dto.phone_number;
    // userUpdateRequest.password = dto.password;
    // await userUpdateRequest.save();

    // return {
    //   status: HttpStatus.OK,
    //   sent_data: dto,
    //   response: {
    //     data: userUpdateRequest,
    //     message: 'Successfully sent email.Waiting for user confirmation',
    //   },
    // };
  }
}
