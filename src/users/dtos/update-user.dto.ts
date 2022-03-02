import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({ example: 'johndoe' })
  @Transform((value: string | null) => value?.toLowerCase().trim())
  @MinLength(6)
  @IsAlphanumeric()
  username: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @Transform((value: string | null) => value?.toLowerCase().trim())
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+639171235545' })
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty()
  @MinLength(6)
  password: string;
}
