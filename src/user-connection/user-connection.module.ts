import { Module } from '@nestjs/common';
import { UserConnectionController } from './user-connection.controller';
import { UserConnectionService } from './user-connection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConnection } from './user-connection.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [UserConnectionController],
  providers: [UserConnectionService],
  imports: [UsersModule, TypeOrmModule.forFeature([UserConnection])],
})
export class UserConnectionModule {}
