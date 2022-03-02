import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import { Transform } from 'class-transformer';

@Entity()
export class UserUpdateRequest extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional()
  @ApiProperty({ example: 'eae25276-3af3-432c-9c1b-7b7548513015' })
  @Transform((value: string | null) => value?.toLowerCase().trim())
  @Column({ nullable: true })
  user_id?: string | null;

  @ApiProperty({ example: '' })
  @Column({ nullable: true })
  hash: string | null;

  @ApiProperty({ example: 'johndoe@example.com' })
  @Transform((value: string | null) => value?.toLowerCase().trim())
  @IsOptional()
  @Column({ nullable: true })
  email: string | null;

  @ApiProperty({ example: 'johndoe' })
  @Transform((value: string | null) => value?.toLowerCase().trim())
  @IsOptional()
  @Column({ nullable: true })
  username: string | null;

  @ApiProperty({ example: '3235534022' })
  @Column({ nullable: true })
  phone_no: string | null;

  @ApiProperty()
  @IsOptional()
  @Column({ nullable: true })
  password: string;
}
