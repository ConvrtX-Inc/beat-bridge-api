import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserConnection } from 'src/user-connection/user-connection.entity';
import { UserQueueService } from 'src/user-queue/user-queue.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { DeleteDto, TrackDto } from './dto/track.dto';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { Track } from './track.entity';
import { throws } from 'assert';

@Injectable()
export class TrackService extends TypeOrmCrudService<Track> {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    private userQueueService: UserQueueService,
  ) {
    super(trackRepository);
  }

  /*
   * save entity
   */
  async saveEntity(data: DeepPartial<Track>[]) {
    return this.trackRepository.save(
      this.trackRepository.create(data),
    );
  }

  /*
  * save single entity
  */
  async saveOne(data) {
    return await this.saveEntity(data);
  }

  // To Increment in the Total_Play_Count of a song 
  async playCount(id: string) {

    const track =  this.trackRepository.findOne({
      id: id,
    });
    (await track).total_play_count++;
    (await track).save();
    return track;
  }

  // Get All Tracks of a user
  async userTracks(id: string, limit: number) {
   
    const query = this.trackRepository.createQueryBuilder('track');
    const userTracks = await query
      .select([           
        'track.id as id ',        
        'track.name as name',
        'track.uri as uri',
        'track.name as name',
        'track.platform as platform',
        'track.queueId ',  
        'track.user_id as user_id',  
        'track.owner as owner',  
        "track.trackData as trackData",  
        'track.total_play_count as total_play_count',  
        'track.created_date as created_date',  
        'track.updated_date as updated_date',  
        'track.deleted_date as deleted_date',  
      ])    
      .where("track.user_id = :id", { id: id })
      .distinctOn(['uri'])
      .limit(limit)
      .getRawMany();       
    return userTracks;
  }

  // Return Track Only using Queue Id
  async queueTracks(id: string) {
    const query = this.trackRepository.createQueryBuilder('track');
    const userTracks = await query
      .select([           
        'track.id as id ',        
        'track.name as name',
        'track.uri as uri',
        'track.name as name',
        'track.platform as platform',
        'track.queueId ',  
        'track.user_id as user_id',  
        'track.owner as owner',  
        "track.trackData as trackData",  
        'track.total_play_count as total_play_count',  
        'track.created_date as created_date',  
        'track.updated_date as updated_date',  
        'track.deleted_date as deleted_date',  
      ])    
      .where("track.queueId  = :id", { id: id })
      .distinctOn(['uri'])    
      .getRawMany();
    return userTracks;

  }

  /*
    Get Top Played Tracks List 
    */  
  async topPlayed(id , req , limit:number){
      
    const query = this.trackRepository.createQueryBuilder('track');
    const userTracks = await query
      .select([           
        'track.id as id ',        
        'track.name as name',
        'track.uri as uri',
        'track.name as name',
        'track.platform as platform',
        'track.queueId ',  
        'track.user_id as user_id',  
        'track.owner as owner',  
        "track.trackData as trackData",  
        'track.total_play_count as total_play_count',  
        'track.created_date as created_date',  
        'track.updated_date as updated_date',  
        'track.deleted_date as deleted_date',  
      ])    
      .where("track.user_id  = :id OR track.queueId = :q_id", { id: id , q_id : id })     
      .orderBy('total_play_count', 'DESC')
      .limit(limit) 
      .getRawMany();
    return userTracks ;
  }

  async create(body: TrackDto) {   
    const newTrack = {
      name: body.name,
      uri: body.uri,
      user_id: body.user_id,
      queueId: body.queueId,
      trackData: body.trackData,
      owner: body.owner
    }
    await this.saveOne(newTrack);
    return {
      message: "Saved"
    }
  }

  async remove(body: DeleteDto) {
    await this.trackRepository.delete(body.trackId);
    return await this.getQueue(body.queueId);
  }

  async getQueue(qid: string) {
    var tracks = await this.trackRepository.find({ where: { queueId: qid } });
    var queue = await this.userQueueService.findOne({ where: { id: qid } });

    var response = {
      queue: queue,
      tracks: tracks,
    };

    return response;
  }
}
