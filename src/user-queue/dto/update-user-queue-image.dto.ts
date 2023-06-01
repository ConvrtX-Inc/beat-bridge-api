import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
  Validate
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Column } from 'typeorm';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

export class UpdateUserQueueImageDto {

    @IsOptional()
    @ApiProperty({ example: '46c53ede-ed7b-4c5d-8bf6-12b8f9dde5bf'})
    id: string;

    @Allow()
    @IsOptional()
    @ApiProperty({ example: 'byte64image' })
    @Column({
        name: 'image',        
        nullable: true,
    })
    image?: string;

}

export class CreateCustomQueueDto{

  @IsNotEmpty()
  @ApiProperty({ example: '46c53ede-ed7b-4c5d-8bf6-12b8f9dde5bf'})
  user_id: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'String'})
  @Validate(IsNotExist,['UserQueue'],{
    message: "Queue Name Already Exist",
  })
  name: string; 

  @IsOptional()
  @ApiProperty({ example: 'byte64image'})
  image: string
}

export class CreatePlatformQueueDto{

  @IsNotEmpty()
  @ApiProperty({ example: '46c53ede-ed7b-4c5d-8bf6-12b8f9dde5bf'})
  user_id: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'String'})
  platform: string; 

  @IsNotEmpty()
  @ApiProperty({ example: 'String'})
  token: string; 

  @IsOptional()
  @ApiProperty({ example: [] })
  queueData: [];

}


export class NearbyQueuesDto {
 
  @ApiProperty({ example: '1.28210155945393' })
  @IsNotEmpty()
  latitude?: string;

  @ApiProperty({ example: '103.81722480263163' })
  @IsNotEmpty()
  longitude?: string;
}
