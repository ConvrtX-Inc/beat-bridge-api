import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DjDto {
  @ApiProperty({ example: 'dabc' })
  @IsNotEmpty()
  queue: string;

  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  track: string;
}
