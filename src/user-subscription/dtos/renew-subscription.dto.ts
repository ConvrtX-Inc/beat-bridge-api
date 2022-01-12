import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class RenewSubscriptionDto {
  @Allow()
  @ApiProperty({
    example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d',
    required: true,
  })
  user_id?: string;   

  @Allow()
  @ApiProperty({
    example: 'MONTHLY',
    required: true,
  })
  code?: string;    

  @Allow()
  @ApiProperty({
    example: '2022-01-01',
    required: true,
  })
  start_date?: string;  

  @Allow()
  @ApiProperty({
    example: '2022-04-01',
    required: true,
  })
  end_date?: string;  

}
