import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, Validate } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import { IsExist } from '../utils/validators/is-exists.validator';

@Entity()
export class UserQueue extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional()
  @ApiProperty({ example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d' })
  @Validate(IsExist, ['User', 'id'], {
    message: 'User not Found',
  })
  @Column({ nullable: true })
  user_id?: string | null;

  @IsOptional()
  @ApiProperty({ example: 'Name' })
  @Column({ length: 100 })
  name?: string;



  
  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'byte64image' })
  @Column({
    name: 'image',
    type: 'bytea',
    nullable: true,
  })
  image?: Buffer;


  user: any;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @DeleteDateColumn()
  deleted_date: Date;
}
