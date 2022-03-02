import { ApiProperty } from "@nestjs/swagger";
import { Allow, IsOptional } from "class-validator";
import { EntityHelper } from "src/utils/entity-helper";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Avatar extends EntityHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Allow()
    @IsOptional()
    @ApiProperty({ example: 'byte64image' })
    @Column({
        name: 'avatar_img',
        type: 'bytea',
        nullable: true,
    })
    avatar_img?: Buffer;

    @IsOptional()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_date?: string;
  
    @IsOptional()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_date?: string;
}
