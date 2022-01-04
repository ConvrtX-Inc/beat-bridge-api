import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FindClosestUsersDto {
  @IsNotEmpty()
  @ApiProperty({ example: '1.28210155945393' })
  latitude?: string;

  @IsNotEmpty()
  @ApiProperty({ example: '103.81722480263163' })
  longitude?: string;
}
