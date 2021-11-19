import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class QueueCreatedDateDto {
  @ApiProperty({ example: '10-24-2021' })
  @IsNotEmpty()
  date: string;
}
