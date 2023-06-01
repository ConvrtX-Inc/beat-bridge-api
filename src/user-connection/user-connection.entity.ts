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
export class UserConnection extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional()
  @ApiProperty({ example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d' })
  @Validate(IsExist, ['User', 'id'], {
    message: 'from_user_id User not Found',
  })
  @Column({ nullable: true })
  from_user_id?: string | null;

  from_user: any;

  to_user: any;

  @IsOptional()
  @ApiProperty({ example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d' })
  @Validate(IsExist, ['User', 'id'], {
    message: 'to_user_id User not Found',
  })
  @Column({ nullable: true })
  to_user_id?: string | null;

  @IsOptional()
  @ApiProperty({ example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d' }) 
  @Column({ nullable: true })
  parent_id?: string | null;

  @IsOptional()
  @ApiProperty({ example: true })
  @Column({ type: 'boolean', nullable: true, default: 'FALSE' })
  is_accepted: boolean | null;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @DeleteDateColumn()
  deleted_date: Date;
}
