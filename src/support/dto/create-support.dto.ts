import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { StatusEnum } from 'src/statuses/statuses.enum';


export class CreateSupportDto {

  @ApiProperty({ example: "a8827f74-df76-4b30-a5c4-170f19b8e5c2" , type : 'uuid'})
  @IsNotEmpty()
  user_id : string; 

  @ApiProperty({ example: "title" })
  @IsNotEmpty()
  title : string; 

  @ApiProperty({ example: "message "})
  @IsNotEmpty()
  message : string;
}