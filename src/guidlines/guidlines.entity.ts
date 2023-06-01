import { EntityHelper } from "src/utils/entity-helper";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum GuidlinesTypesEnum {
    TERM_CONDITION = 'termsCondition',
    PRIVACY_POLICY = 'privacyPolicy',
    FAQ = 'faq'
}

@Entity()
export class Guidlines extends EntityHelper {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true, type: "text" })
    description: string;

    @Column({ nullable: true, type: "text" })
    questions: string;

    @Column({ nullable: false, type: 'enum', enum: GuidlinesTypesEnum })
    type: GuidlinesTypesEnum;

    @CreateDateColumn()
    created_date?: Date | null;

    @UpdateDateColumn()
    updated_date?: Date | null;
}