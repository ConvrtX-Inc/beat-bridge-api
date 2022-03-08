import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SysSupportService } from './support.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysSupport } from './support.entity';


@Module({
  controllers: [SupportController],
  providers: [SysSupportService],
  imports: [TypeOrmModule.forFeature([SysSupport])],

})
export class SupportModule {

}
