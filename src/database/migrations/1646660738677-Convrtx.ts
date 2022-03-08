import {MigrationInterface, QueryRunner} from "typeorm";

export class Convrtx1646660738677 implements MigrationInterface {
    name = 'Convrtx1646660738677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "avatar" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "avatar_img" bytea, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_50e36da9d45349941038eaf149d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(50) NOT NULL, "email" character varying, "provider" character varying NOT NULL DEFAULT 'email', "phone_no" character varying, "password" character varying, "stripe_customer_id" character varying, "avatar_id" character varying, "hash" character varying, "socialId" character varying, "latitude" text, "longitude" text, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e282acb94d2e3aec10f480e4f6" ON "user" ("hash") `);
        await queryRunner.query(`CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `);
        await queryRunner.query(`CREATE TABLE "forgot" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_087959f5bb89da4ce3d763eab75" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_df507d27b0fb20cd5f7bef9b9a" ON "forgot" ("hash") `);
        await queryRunner.query(`CREATE TABLE "queue_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_queue_id" character varying, "user_id" character varying, "is_admin" boolean DEFAULT 'TRUE', "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_22356790641c46ce7bba2cf0cdd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "queue_playlist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_queue_id" character varying, "item_metadata" text, "item_link" text DEFAULT '', "total_play_count" integer DEFAULT '0', "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8de758192737bb7552b5f582f1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status_name" character(20), "is_active" boolean, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sys_support" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user" character varying(50) NOT NULL, CONSTRAINT "PK_771714c2907b4a2a9865ac29ef7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_update_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying, "hash" character varying, "email" character varying, "username" character varying, "phone_no" character varying, "password" character varying, CONSTRAINT "PK_0f841ad8b70af8a4b3bc56f314a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_connection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from_user_id" character varying, "to_user_id" character varying, "is_accepted" boolean DEFAULT 'FALSE', "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_90c4161e28ad49adb32fcc076ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_queue" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying, "name" character varying(100) NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, CONSTRAINT "PK_bbc78902c7d22324245938dd3bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying, "start_date" TIMESTAMP NOT NULL DEFAULT now(), "end_date" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying(50) NOT NULL, "cost" numeric(12,2) NOT NULL DEFAULT '0', "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ec4e57f4138e339fb111948a16f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "forgot" ADD CONSTRAINT "FK_31f3c80de0525250f31e23a9b83" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forgot" DROP CONSTRAINT "FK_31f3c80de0525250f31e23a9b83"`);
        await queryRunner.query(`DROP TABLE "user_subscription"`);
        await queryRunner.query(`DROP TABLE "user_queue"`);
        await queryRunner.query(`DROP TABLE "user_connection"`);
        await queryRunner.query(`DROP TABLE "user_update_request"`);
        await queryRunner.query(`DROP TABLE "sys_support"`);
        await queryRunner.query(`DROP TABLE "status"`);
        await queryRunner.query(`DROP TABLE "queue_playlist"`);
        await queryRunner.query(`DROP TABLE "queue_member"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df507d27b0fb20cd5f7bef9b9a"`);
        await queryRunner.query(`DROP TABLE "forgot"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e282acb94d2e3aec10f480e4f6"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "avatar"`);
    }

}
