import {MigrationInterface, QueryRunner} from "typeorm";

export class Convrtx1657756493037 implements MigrationInterface {
    name = 'Convrtx1657756493037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track" ADD "uri" character varying`);
        await queryRunner.query(`ALTER TABLE "track" ADD "queueId" character varying`);
        await queryRunner.query(`ALTER TABLE "queue_member" ALTER COLUMN "is_admin" SET DEFAULT 'TRUE'`);
        await queryRunner.query(`ALTER TABLE "user_connection" ALTER COLUMN "is_accepted" SET DEFAULT 'FALSE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_connection" ALTER COLUMN "is_accepted" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "queue_member" ALTER COLUMN "is_admin" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "queueId"`);
        await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "uri"`);
    }

}
