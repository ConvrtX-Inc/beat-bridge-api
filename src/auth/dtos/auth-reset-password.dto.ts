import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AuthResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  hash: string;
}

export class AuthResetPasswordAdminDto {
  @ApiProperty()
  @IsOptional()
  password: string;
}

export class OtpVerifyDto {

  @ApiProperty({ example: "2323" })
  @IsNotEmpty()
  hash: string;
}
