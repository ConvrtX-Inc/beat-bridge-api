import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsPhoneNumber, MinLength, Validate } from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { Transform } from 'class-transformer';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'johndoe' })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsNotExist, ['User'], {
    message: 'usernameAlreadyExists',
  })
  @IsAlphanumeric()
  @MinLength(6)
  username: string;
  
  @ApiProperty({ example: 'test1@example.com' })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+639171235545'})
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty()
  @MinLength(6)
  password: string;
}
