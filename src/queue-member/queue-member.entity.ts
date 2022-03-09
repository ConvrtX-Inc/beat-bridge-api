import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import { IsExist } from '../utils/validators/is-exists.validator';

@Entity()
export class QueueMember extends EntityHelper {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional()
  @ApiProperty({ example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d' })
  @Validate(IsExist, ['UserQueue', 'id'], {message: 'User not Found',})
  @Column({ nullable: true })
  user_queue_id?: string | null;

  @IsOptional()
  @ApiProperty({ example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d' })
  @Validate(IsExist, ['User', 'id'], {message: 'User not Found',})
  @Column({ nullable: true })
  user_id?: string | null;

  user: any;

  user_queue: any;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', nullable: true, default: 'TRUE' })
  is_admin: boolean | null;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @DeleteDateColumn()
  deleted_date: Date;
}
