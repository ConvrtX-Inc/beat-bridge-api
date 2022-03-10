import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Validate,IsPhoneNumber } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Transform } from 'class-transformer';

export class AuthMobileDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsExist, ['User'], {
    message: 'mobileNotExist',
  })
  phone_no: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @ApiProperty({ example: '1.28210155945393' })
  latitude?: string;

  @IsNotEmpty()
  @ApiProperty({ example: '103.81722480263163' })
  longitude?: string;
}
