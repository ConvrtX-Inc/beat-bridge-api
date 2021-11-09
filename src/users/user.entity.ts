import {
  Column,
  AfterLoad,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import * as bcrypt from 'bcryptjs';
import { EntityHelper } from 'src/utils/entity-helper';
import { CrudValidationGroups } from '@nestjsx/crud';
import { AuthProvidersEnum } from 'src/auth/auth-providers.enum';
import { IsExist } from 'src/utils/validators/is-exists.validator';

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'johndoe' })
  @Column({ nullable: false, type: 'varchar', length: 50 })
  username: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @Transform((value: string | null) => value?.toLowerCase().trim())
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
    groups: [CrudValidationGroups.CREATE],
  })
  @IsEmail()
  @Column({ unique: true, nullable: true })
  email: string | null;

  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @ApiProperty({ example: '3235534022' })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @Column({ nullable: true })
  phone_no: string | null;

  @ApiProperty()
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @MinLength(6, {
    groups: [CrudValidationGroups.CREATE],
  })
  @Column({ nullable: true })
  password: string;

  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @IsOptional()
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Column({ type: 'uuid', nullable: true })
  @Validate(IsExist, ['Avatar', 'id'], {
    message: 'statusNotExists',
    groups: [CrudValidationGroups.UPDATE],
  })
  avatar_id?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  @Index()
  hash: string | null;

  @Index()
  @Column({ nullable: true })
  socialId: string | null;

  @IsOptional()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date?: string;

  @IsOptional()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_date?: string;

  @DeleteDateColumn()
  deleted_date?: Date;
}
