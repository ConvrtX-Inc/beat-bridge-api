import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class QueueNearMeDto {
  @ApiProperty({ example: 'uuid' })
  @IsNotEmpty()
  location: string;
}
