import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TrackDto{
    @ApiProperty({ example: 'uuid' })
    @IsNotEmpty()
    queue_id: string;
    @ApiProperty({ example: 'track-id' })
    @IsNotEmpty()
    uri: string;
}

export class DeleteDto{
    @ApiProperty({ example: 'queue-id' })
    @IsNotEmpty()
    queueId: string;
    @ApiProperty({ example: 'track-id' })
    @IsNotEmpty()
    trackId: string;
}