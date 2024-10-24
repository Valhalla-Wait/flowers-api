import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPassword1729419097079 implements MigrationInterface {
    name = 'AddUserPassword1729419097079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_access_token_id" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_access_token_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
