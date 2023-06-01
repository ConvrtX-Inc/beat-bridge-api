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

export enum SupportStatusEnum {
  PENDING = "pending",
  APPROVED = "approved",
}

@Entity()
export class SysSupport extends EntityHelper{

    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Validate(IsExist, ['User', 'id'], {message: 'User not Found',})
    @Column({ nullable: false, type :'uuid' })
    user_id?: string | null;
    
    @IsOptional()
    @ApiProperty({ example: 'Crash report' })
    @Column({ nullable: false, type:'text' })
    message?:  string | null;   

    @Column({nullable: true , type: 'text'})
    title : string;

    @Column({nullable : true , type : 'enum' , enum : SupportStatusEnum , default : SupportStatusEnum.PENDING})
    status : SupportStatusEnum

    @CreateDateColumn()
    created_date?: Date | null;
    
    @UpdateDateColumn()
    updated_date?: Date | null;
}