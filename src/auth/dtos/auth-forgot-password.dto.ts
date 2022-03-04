import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthForgotPasswordDto {
  @ApiProperty()
  @Transform((value: string | null) =>
    value == '' ? null : value.toLowerCase().trim(),
  )
  @IsEmail()
  @IsOptional()
  email?: string | null;

  @ApiProperty()
  @Transform((value: string | null) => (value == '' ? null : value))
  @IsOptional()
  phone_no?: string | null;

}
