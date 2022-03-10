import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { StatusEnum } from 'src/statuses/statuses.enum';


export class UpdateStatusDto{

  @IsOptional()
  @ApiProperty({ example: '1dd2ee6c-f4ce-4374-9ae6-786f7d6a4f15'})
  id: string;
  @IsOptional()
  @ApiProperty({ example:StatusEnum.active})
  status: string;
  
}