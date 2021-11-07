import { Module } from '@nestjs/common';
import { UserConnectionController } from './userConnection.controller';
import { UserConnectionService } from './userConnection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConnection } from './userConnection.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [UserConnectionController],
  providers: [UserConnectionService],
  imports: [UsersModule, TypeOrmModule.forFeature([UserConnection])],
})
export class UserConnectionModule {}
