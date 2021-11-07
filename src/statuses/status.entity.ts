import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';

@Entity()
export class Status extends EntityHelper {
  @ApiProperty({ example: 'eae25276-3af3-432c-9c1b-7b7548513015' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Allow()
  @ApiProperty({ example: 'Active' })
  @Column({ type: 'char', nullable: true, length: 20 })
  status_name: string | null;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', nullable: true })
  is_active: boolean;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
