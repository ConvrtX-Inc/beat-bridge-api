import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SourcePlatformDto {
  @ApiProperty({ example: 'spotify' })
  @IsNotEmpty()
  source: string;
}
