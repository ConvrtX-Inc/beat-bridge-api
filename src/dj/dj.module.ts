import { Module } from '@nestjs/common';
import { DjService } from './dj.service';
import { DjController } from './dj.controller';

@Module({
  providers: [DjService],
  controllers: [DjController]
})
export class DjModule {}
