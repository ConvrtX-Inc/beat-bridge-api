import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class SendFriendRequestDto {
  @Allow()
  @ApiProperty({
    example: 'test1@example.com',
    required: true,
  })
  email?: string;
}
