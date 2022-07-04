import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsArray, IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class QueueMembersBatchDto {
    @IsArray()
    @Allow()
    @ApiProperty()
    users: string[]
    @Allow()
    @ApiProperty({
      example: 'de5c7612-19a7-4d67-8f3e-a2fae10f7af6',
      required: true,
    })
    queueId?: string;

}


