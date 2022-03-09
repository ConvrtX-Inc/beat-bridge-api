import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import { IsExist } from '../utils/validators/is-exists.validator';

@Entity()
export class SysSupport extends EntityHelper{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'b8d8ba54-b6d8-4459-8ac4-11ca37e7cfbc' })
    @Validate(IsExist, ['User', 'id'], {message: 'User not Found',})
    @Column({ nullable: false, type :'uuid' })
    user_id?: string | null;
    
    @IsOptional()
    @ApiProperty({ example: 'Crash report' })
    @Column({ nullable: false, type:'text' })
    message?:  string | null;

    @IsOptional()
    @Column({ nullable: false, type :'uuid' })
    @ApiProperty({ example: StatusEnum.active })
    status_id?: string | null;
    
    @Column({ nullable: false, type :'uuid' })
    parent_sys_support_id?: string | null;
    
  
    @CreateDateColumn()
    created_date?: Date | null;
    
    @UpdateDateColumn()
    updated_date?: Date | null;

}