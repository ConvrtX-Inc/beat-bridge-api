import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserConnection } from 'src/user-connection/user-connection.entity';
import { UserQueueService } from 'src/user-queue/user-queue.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { DeleteDto, TrackDto } from './dto/track.dto';
import { Track } from './track.entity';

@Injectable()
export class TrackService extends TypeOrmCrudService<Track> {

    constructor(
        @InjectRepository(Track)
        private trackRepository: Repository<Track>,
        private userQueueService: UserQueueService,
      ) {
        super(trackRepository);
      }


      async create(body:TrackDto){

        var track = new Track();
        track.queueId = body.queue_id;
        track.uri = body.uri;
        await track.save();
        return await this.getQueue(body.queue_id);

      }

      
      async remove(body:DeleteDto){

        await this.trackRepository.delete(body.trackId);
        return await this.getQueue(body.queueId);

      }


      async getQueue(qid:string){
        var tracks = await this.trackRepository.find({where:{queueId:qid}})
        var queue = await this.userQueueService.findOne({where:{id:qid}})

        var response = {
          queue:queue,
          tracks:tracks
        };

        return response;

      }



}
