import {MigrationInterface, QueryRunner} from "typeorm";

export class Convrtx1671088531516 implements MigrationInterface {
    name = 'Convrtx1671088531516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue_member" ALTER COLUMN "is_admin" SET DEFAULT 'FALSE'`);
        await queryRunner.query(`ALTER TABLE "user_connection" ALTER COLUMN "is_accepted" SET DEFAULT 'FALSE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_connection" ALTER COLUMN "is_accepted" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "queue_member" ALTER COLUMN "is_admin" SET DEFAULT false`);
    }

}
