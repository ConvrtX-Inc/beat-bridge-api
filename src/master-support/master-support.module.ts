import {Module} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterSupportController } from './master-support.controller'
import { MasterSupport } from './master-support.entity';
import { MasterSupportService} from './master-support.service';

@Module({
    controllers:[MasterSupportController],
    providers:[MasterSupportService],
    imports:[TypeOrmModule.forFeature([MasterSupport])]
})

export class MasterSupportModule {}