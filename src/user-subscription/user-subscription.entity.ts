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
  export class UserSubscription extends EntityHelper {
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
    @ApiProperty({ example: '2022-01-01' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    start_date?: string;
    
    @IsOptional()
    @ApiProperty({ example: '2022-04-01' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    end_date?: string;
  
    @IsOptional()
    @ApiProperty({ example: 'MONTHLY' })
    @Column({ length: 50 })
    code?: string;
  
    @IsOptional()
    @ApiProperty({ example: '2.99' })
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    cost?: string;
  
    @CreateDateColumn()
    created_date: Date;
  
    @UpdateDateColumn()
    updated_date: Date;

  }
  