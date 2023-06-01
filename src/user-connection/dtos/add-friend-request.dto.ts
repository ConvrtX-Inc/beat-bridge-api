import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Column } from 'typeorm';

export class AddFriendDto {
  @Allow()
  @ApiProperty({
    example: 'de5c7612-19a7-4d67-8f3e-a2fae10f7af6',
    required: true,
  })
   @Validate(IsExist, ['User'], {
    message: 'userDoesnotExist',
  })
  id?: string;
}

export class CheckFriendDto{
  @Allow()
  @IsNotEmpty()
  @ApiProperty({example : "de5c7612-19a7-4d67-8f3e-a2fae10f7af6"})
  friend_id : string;
}