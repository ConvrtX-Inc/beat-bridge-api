import { IsOptional } from "class-validator";
import { EntityHelper } from "src/utils/entity-helper";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Track extends EntityHelper{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({nullable:true})
    @IsOptional()
    uri:string;
    @Column({nullable:true})
    @IsOptional()
    queueId:string;


  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @DeleteDateColumn()
  deleted_date: Date;
    
}