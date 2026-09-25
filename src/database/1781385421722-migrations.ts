import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1781385421722 implements MigrationInterface {
  name = 'Migrations1781385421722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "product_consumables" DROP CONSTRAINT "FK_d3ec390145c896d5eac9966b72d"',
    );
    await queryRunner.query(
      'ALTER TABLE "product_consumables" DROP CONSTRAINT "FK_06ca413bd860d35542634ab9058"',
    );
    await queryRunner.query(
      'CREATE TABLE "files" ("created_at" TIMESTAMP NOT NULL DEFAULT (\'now\'::text)::timestamp without time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT (\'now\'::text)::timestamp without time zone, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "original_name" character varying NOT NULL, "mime_type" character varying NOT NULL, "size" integer NOT NULL, "key" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'ALTER TABLE "product_consumables" ADD CONSTRAINT "FK_d948a285b1e239757cd8f925751" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "product_consumables" ADD CONSTRAINT "FK_cb946fbb374715ecddece000c51" FOREIGN KEY ("consumable_id") REFERENCES "consumables"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "product_consumables" DROP CONSTRAINT "FK_cb946fbb374715ecddece000c51"',
    );
    await queryRunner.query(
      'ALTER TABLE "product_consumables" DROP CONSTRAINT "FK_d948a285b1e239757cd8f925751"',
    );
    await queryRunner.query('DROP TABLE "files"');
    await queryRunner.query(
      'ALTER TABLE "product_consumables" ADD CONSTRAINT "FK_06ca413bd860d35542634ab9058" FOREIGN KEY ("consumable_id") REFERENCES "consumables"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "product_consumables" ADD CONSTRAINT "FK_d3ec390145c896d5eac9966b72d" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }
}
