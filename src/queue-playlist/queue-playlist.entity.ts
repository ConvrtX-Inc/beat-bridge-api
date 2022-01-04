import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import { IsExist } from '../utils/validators/is-exists.validator';

@Entity()
export class QueuePlaylist extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional()
  @ApiProperty({ example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d' })
  @Validate(IsExist, ['UserQueue', 'id'], {
    message: 'UserQueue not Found',
  })
  @Column({ nullable: true })
  user_queue_id?: string | null;

  @IsOptional()
  @ApiProperty({ example: '{"name":"John", "age":30, "car":null}' })
  @Column({ type: 'simple-json', nullable: true })
  item_metadata?: string | null;

  @IsOptional()
  @ApiProperty({ example: true })
  @Column({ type: 'text', nullable: true, default: '' })
  item_link: string | null;

  @IsOptional()
  @ApiProperty({example: 1})
  @Column({type: 'int', nullable: true, default : 0 })
  total_play_count: number | null;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
