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

export class TrackHistory extends EntityHelper{

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'b8d8ba54-b6d8-4459-8ac4-11ca37e7cfbc' })
  @Column({ nullable: false, type :'uuid' })
  track_id?: string | null;

  @ApiProperty({ example: 'b8d8ba54-b6d8-4459-8ac4-11ca37e7cfbc' })
  @Column({ nullable: false, type :'uuid' })
  user_id?: string | null;

  @ApiProperty({ example: 'b8d8ba54-b6d8-4459-8ac4-11ca37e7cfbc' })
  @Column({ nullable: false, type :'uuid' })
  queue_id?: string | null;
 
  @CreateDateColumn()
  created_date?: Date | null;
  
};