import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class QueueNameDto {
  @ApiProperty({ example: 'e-dow' })
  @IsNotEmpty()
  name: string;
}
