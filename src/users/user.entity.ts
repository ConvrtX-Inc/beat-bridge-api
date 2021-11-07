import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  @Index()
  hash: string | null;

  @Index()
  @Column({ nullable: true })
  socialId: string | null;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  username: string;

  @ApiProperty({ example: 'test1@example.com' })
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

  @ApiProperty({ example: 'John' })
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

  @Column({ nullable: true, type: 'uuid' })
  avatar_id?: string;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @DeleteDateColumn()
  deleted_date: Date;
}
