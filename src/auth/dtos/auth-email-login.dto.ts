import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Transform } from 'class-transformer';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsExist, ['User'], {
    message: 'emailNotExists',
  })
  email: string;

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

export class AuthEmailLoginUsernameDto {
  @ApiProperty({ example: 'johndoe' })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsExist, ['User'], {
    message: 'username does not exist',
  })
  username: string;

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
