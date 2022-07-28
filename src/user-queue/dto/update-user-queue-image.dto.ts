import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Column } from 'typeorm';

export class UpdateUserQueueImageDto {

    @IsOptional()
    @ApiProperty({ example: '46c53ede-ed7b-4c5d-8bf6-12b8f9dde5bf'})
    id: string;

    @IsOptional()
    @ApiProperty({ example: 'www.somewhere-in-firebase.com'})
    imageUrl: string;

    @Allow()
    @IsOptional()
    @ApiProperty({ example: 'byte64image' })
    @Column({
        name: 'image',
        type: 'bytea',
        nullable: true,
    })
    image?: Buffer;

}
