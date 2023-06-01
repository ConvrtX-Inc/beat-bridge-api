import { ApiProperty } from '@nestjs/swagger';
import { integer } from 'aws-sdk/clients/cloudfront';
import { IsOptional } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Track extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty({ example: 'song name' })
  @IsOptional()
  name: string;

  @Column({default: 0})
  @ApiProperty({ example: 'song name' })
  @IsOptional()
  total_play_count: number;

  @Column({ nullable: true })
  @IsOptional()
  uri: string;

  @Column({ nullable: true })
  @IsOptional()
  platform: string;

  @Column({ nullable: true })
  @IsOptional()
  queueId: string;

  @Column({ nullable: true })
  @IsOptional()
  user_id: string;

  @IsOptional()
  @Column('jsonb',{nullable: true })
  trackData?: object[];

  @IsOptional()
  @Column('jsonb',{nullable: true })
  owner?: object[];

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @DeleteDateColumn()
  deleted_date: Date;
}
