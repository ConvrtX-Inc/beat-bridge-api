import { HttpStatus, Injectable, ForbiddenException, HttpException } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { UserQueue } from './user-queue.entity';
import { User } from "../users/user.entity"
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../utils/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { NearbyQueuesDto, UpdateUserQueueImageDto } from './dto/update-user-queue-image.dto';
import { CrudRequest } from '@nestjsx/crud';
import { HttpService } from '@nestjs/axios';
import { catchError, map, lastValueFrom } from 'rxjs';
import { Track } from 'src/track/track.entity';
import { AllowedPlatforms } from '../enum/trackEnums';
import { QueueMember } from '../queue-member/queue-member.entity';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as fs from 'fs'
import { QueueMemberService } from 'src/queue-member/queue-member.service';
@Injectable()
export class UserQueueService extends TypeOrmCrudService<UserQueue> {
  constructor(
    @InjectRepository(UserQueue)
    private destinationsRepository: Repository<UserQueue>,
    private readonly queueMemberService: QueueMemberService,
    private http: HttpService
  ) {
    super(destinationsRepository);
  }
  /*
   * Get Many Queue
   */

  async getManyQueues(dto: NearbyQueuesDto, limit: number, id: string) {

    var results = [];
    const query = User.createQueryBuilder('u');
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
      .limit(limit)
      .getRawMany();

    for (let i = 0; i < users.length; i++) {
      if (
        this.closestLocation(
          parseFloat(dto.latitude),
          parseFloat(dto.longitude),
          parseFloat(users[i]['latitude']),
          parseFloat(users[i]['longitude']),
          'K',
        ) <= 50
      ) {       
        results.push(users[i]['id']);
      }

    }

    const userQueues = await this.destinationsRepository
      .createQueryBuilder('q')
      .where('q.user_id IN (:...userIds)', { userIds: results })
      .getMany();
    return userQueues;
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
    const km = Math.round(d / 1000);
    // console.log(km);
    return km;
  }

  /*
  * Get Only User Queue
  */

  async getUserQueues(id: string) {
    var allQueues = [];

    const userQueue = await this.destinationsRepository.find({
      user_id: id
    });
    allQueues = [...userQueue];
    // Finding Member Queue
    const memberQueue = await QueueMember.find({
      user_id: id
    });
    for (let i = 0; i < memberQueue.length; i++) {
      if (memberQueue[i].user_queue_id) {
        const queue = await this.destinationsRepository.findOne({
          id: memberQueue[i].user_queue_id
        });
        allQueues.push(queue);
      }
    }
    return allQueues;
  }

  /*
   * Save Custom Queue
   */
  async createCustomeQueue(body, req) {
    var imagePath = null;
    if (body.image) {
      let base64 = body.image;
      const buffer = Buffer.from(base64, "base64");
      const randomString = randomStringGenerator();
      fs.writeFileSync(`files/queue/${randomString}.jpeg`, buffer);
      imagePath = `/queue/${randomString}.jpeg`;
    }
    const user = await User.findOne({
      id: req.id
    })
    body['created_by'] = user.username;
    body.image = imagePath;
    const queue = await this.saveEntity(body);
    // const member =  {
    //   user_queue_id: queue['id'],
    //   user_id: req.id,
    //   is_admin: true
    // }
    // await this.queueMemberService.createOneMember(member)
    return queue;
  }


  /*
   * Save Platform Queue
   */
  async addQueue(data) {

    //checking if Spotif Playlist Already Exist
    const isExist = await this.destinationsRepository.find({
      where: {
        user_id: data.user_id,
        platform: AllowedPlatforms.SPOTIFY,
      }
    })
    // Deleting Existing Playlist
    if (isExist) {
      isExist.forEach(async (playlist) => {
        await this.destinationsRepository.delete(playlist.id);
      })
    }
    // checking if Spotif Tracks Already Exist
    const existTracks = await Track.find({
      where: {
        user_id: data.user_id,
        platform: AllowedPlatforms.SPOTIFY,
      }
    });
    if (existTracks) {
      existTracks.forEach(async (track) => {
        await Track.delete(track.id);
      })
    }
    // Adding New Queues and Tracks from Spotify
    if (data.platform === 'spotify') {
      var spotifyData = {};
      spotifyData['user_id'] = data.user_id;
      var playlists = data.queueData[0].items;

      playlists.forEach(async (element) => {
        var token = data.token;
        try {
          // Storing Data in User-queue Table
          const items = element;
          const name = items.name;
          spotifyData['queueData'] = items;
          spotifyData['name'] = name;
          spotifyData['platform'] = 'spotify';
          const singleQueue = await this.destinationsRepository.insert(spotifyData);
          var playlistId = element.id;
          const res = this.http
            .get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .pipe(
              map((res) => res.data)
            )
            .pipe(
              catchError(() => {
                throw new ForbiddenException('Not Authenticated');
              }),
            );
          // Storing Data in Tracks Table        
          res.subscribe(async (x) => {
            var playlistTracks = x.tracks.items;
            playlistTracks.forEach(async (element) => {
              var track = new Track();
              track.name = element.track.name;
              track.uri = element.track.uri;
              track.trackData = element;
              track.platform = AllowedPlatforms.SPOTIFY;
              track.queueId = singleQueue.identifiers[0].id;
              track.owner = x.owner;
              track.user_id = data.user_id;
              await track.save();
            })
          })

        } catch (err) {
          throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
      });
      return {
        status: HttpStatus.OK,
        response: {
          message: 'Successfully Linked with Spotify',
        },
      };
    } else {
      await this.destinationsRepository.insert(spotifyData);
      return {
        status: HttpStatus.OK,
        response: {
          message: 'Successfully Queue Created',
        },
      };
    }
  }

  /*
   * find one entity
   */
  async findOneEntity(options: FindOptions<UserQueue>) {
    return this.destinationsRepository.findOne({
      where: options.where,
    });
  }

  /*
   * find many entity
   */
  async findManyEntities(options: FindOptions<UserQueue>) {
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
  async saveEntity(data: DeepPartial<UserQueue>[]) {
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

  // Updates ticket status
  async updateImage(userId: String, dto: UpdateUserQueueImageDto) {

    const queue = await this.findOne({
      where: {
        id: dto.id,
        user_id: userId,
      },
    });
    if (queue) {
      let imagePath = null;
      if (dto.image) {
        let base64 = dto.image;
        const buffer = Buffer.from(base64, "base64");
        const randomString = randomStringGenerator();
        fs.writeFileSync(`files/queue/${randomString}.jpeg`, buffer);
        imagePath = `/queue/${randomString}.jpeg`;
        queue.image = imagePath;
        return queue.save();
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          response: {
            message: 'No image was set',
          },
        };
      }
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        response: {
          message: 'Queue not found',
        },
      };
    }
    // const support = await this.findOne(
    //   {
    //     where:{id:dto.id}
    //   }
    // )
    // if(!support)
    // {
    //   return {
    //     status : HttpStatus.BAD_REQUEST,
    //     sent_data: dto,
    //     response:{
    //       message:'Ticket not found'
    //     }
    //   }
    // }
    // else
    // {
    //   support.status_id = dto.status;
    //   support.save();
    //   return support;
    // }
  }
}
