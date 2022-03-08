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
export class SysSupport extends EntityHelper{

    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ApiProperty({ example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d' })
    @Validate(IsExist, ['User', 'id'], {
        message: 'User not Found',
    })
    @Column({ nullable: false, type :'uuid' })
    user_id?: string | null;
    @Column({ nullable: false, type:'text' })
    message?: string | null;
    @Column({ nullable: false, type :'uuid' })
    status_id?: string | null;
    @Column({ nullable: false, type :'uuid' })
    parent_sys_support_id?: string | null;
    @CreateDateColumn()
    @Column({ nullable: false, type :'timestamp' })
    created_date?: Date | null;
    @UpdateDateColumn()
    @Column({ nullable: false, type :'timestamp' })
    updated_date?: Date | null;

}