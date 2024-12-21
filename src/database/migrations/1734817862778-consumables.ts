import { MigrationInterface, QueryRunner } from "typeorm";

export class Consumables1734817862778 implements MigrationInterface {
    name = 'Consumables1734817862778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "consumables" ("created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "count" integer NOT NULL, CONSTRAINT "PK_88ce43ef80ea7ac74b91dbd8614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products_consumables_consumables" ("products_id" uuid NOT NULL, "consumables_id" uuid NOT NULL, CONSTRAINT "PK_6fb6c0a7dee2d862ae3a2e9e75f" PRIMARY KEY ("products_id", "consumables_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_76f9d2b8b9116c878f7237ea2b" ON "products_consumables_consumables" ("products_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8975d6633cf5a59798fef3ffb5" ON "products_consumables_consumables" ("consumables_id") `);
        await queryRunner.query(`ALTER TABLE "products_consumables_consumables" ADD CONSTRAINT "FK_76f9d2b8b9116c878f7237ea2b3" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_consumables_consumables" ADD CONSTRAINT "FK_8975d6633cf5a59798fef3ffb51" FOREIGN KEY ("consumables_id") REFERENCES "consumables"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products_consumables_consumables" DROP CONSTRAINT "FK_8975d6633cf5a59798fef3ffb51"`);
        await queryRunner.query(`ALTER TABLE "products_consumables_consumables" DROP CONSTRAINT "FK_76f9d2b8b9116c878f7237ea2b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8975d6633cf5a59798fef3ffb5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_76f9d2b8b9116c878f7237ea2b"`);
        await queryRunner.query(`DROP TABLE "products_consumables_consumables"`);
        await queryRunner.query(`DROP TABLE "consumables"`);
    }

}
