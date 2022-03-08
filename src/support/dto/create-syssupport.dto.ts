import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
export class CreateSysSupportDto{
    
  @ApiProperty({ example: 'test1@example.com' })
  user_id?: string | null;
    
  @IsNotEmpty()
  @ApiProperty({ example: 'Crash report' })
  message?: string;
    
   @ApiProperty({ example: 'test1@example.com' })
  status_id?: string | null;

}