import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class FetchByUserDto {
  @Allow()
  @ApiProperty({
    example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d',
  })
  id?: string;
}
