import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChargeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  payment_method_id: string;

  @IsNumber()
  @ApiProperty({ example: 552 })
  amount: number;
}

export default CreateChargeDto;
