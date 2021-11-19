import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class QueueCreatorDto {
  @ApiProperty({ example: 'uuid' })
  @IsNotEmpty()
  creator_id: string;
}
