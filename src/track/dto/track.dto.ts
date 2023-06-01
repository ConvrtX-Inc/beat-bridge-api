import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, } from 'class-validator';

export class TrackDto {

  @ApiProperty({ example: 'song name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'track-id' })
  @IsNotEmpty()
  uri: string;
  
  @ApiProperty({ example: '35e3f4a5-fe40-451b-9190-b6d5ab844eda' })
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: '35e3f4a5-fe40-451b-9190-b6d5ab844eda' })
  @IsNotEmpty()
  queueId: string;
  
  @ApiProperty({ example:{} })
  @IsNotEmpty()
  trackData?: object[];

  @ApiProperty({ example:{} })
  @IsNotEmpty()
  owner?: object[];
}

export class DeleteDto {
  @ApiProperty({ example: 'queue-id' })
  @IsNotEmpty()
  queueId: string;
  @ApiProperty({ example: 'track-id' })
  @IsNotEmpty()
  trackId: string;
}
