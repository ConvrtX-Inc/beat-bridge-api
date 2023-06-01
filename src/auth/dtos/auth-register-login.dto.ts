import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsPhoneNumber, MinLength, Validate, Allow,IsOptional } from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { Transform } from 'class-transformer';
import { Column } from 'typeorm';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'johndoe' })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsNotExist, ['User'], {
    message: 'usernameAlreadyExists',
  })
  @IsAlphanumeric()
  @MinLength(6)
  username: string;
  
  @ApiProperty({ example: 'test1@example.com' })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsNotExist, ['User'], {
    message: 'Email Already Exists',
  })
  @IsEmail()
  email: string;

  @Allow()
    @IsOptional()
    @ApiProperty({ example: 'byte64image' })
    @Column({
        name: 'image',
        type: 'bytea',
        nullable: true,
    })
    image?: string;

  @ApiProperty({ example: '+639171235545'})
  @Validate(IsNotExist, ['User'], {
    message: 'Phone Number Already Exist',
  })
  @IsPhoneNumber()  
  phone_no: string;

  @ApiProperty()
  @MinLength(6)
  password: string;


}
