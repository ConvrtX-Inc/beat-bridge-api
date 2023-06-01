import {Module} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackHistoryController } from './track-history.controller';
import { TrackHistory } from './track-history.entity';
import { TrackHistoryService } from './track-history.service';


@Module({
    controllers:[TrackHistoryController],
    providers:[TrackHistoryService],
    imports:[TypeOrmModule.forFeature([TrackHistory])]
})

export class TrackHistoryModule {}