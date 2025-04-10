import { MigrationInterface, QueryRunner } from "typeorm";

export class Consumables1735566910488 implements MigrationInterface {
    name = 'Consumables1735566910488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "consumables" ("created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "count" integer NOT NULL, CONSTRAINT "PK_88ce43ef80ea7ac74b91dbd8614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "productConsumables" ("created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "required_count" integer NOT NULL, "product_id" uuid, "consumable_id" uuid, CONSTRAINT "PK_e4e23fd2d8dc760fba4583ae729" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "productConsumables" ADD CONSTRAINT "FK_d3ec390145c896d5eac9966b72d" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productConsumables" ADD CONSTRAINT "FK_06ca413bd860d35542634ab9058" FOREIGN KEY ("consumable_id") REFERENCES "consumables"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productConsumables" DROP CONSTRAINT "FK_06ca413bd860d35542634ab9058"`);
        await queryRunner.query(`ALTER TABLE "productConsumables" DROP CONSTRAINT "FK_d3ec390145c896d5eac9966b72d"`);
        await queryRunner.query(`DROP TABLE "productConsumables"`);
        await queryRunner.query(`DROP TABLE "consumables"`);
    }

}
