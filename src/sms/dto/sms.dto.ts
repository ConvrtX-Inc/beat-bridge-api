import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class SmsDto {
  @ApiProperty({ example: '+639506703405' })
  @IsNotEmpty()
  @Transform((value: string) => value.toLowerCase().trim())
  phone_number: string;

  @ApiProperty({ example: 'message' })
  @IsNotEmpty()
  @Transform((value: string) => value.trim())
  message: string;
}
