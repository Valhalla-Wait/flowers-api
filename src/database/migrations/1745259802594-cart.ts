import { MigrationInterface, QueryRunner } from "typeorm";

export class Cart1745259802594 implements MigrationInterface {
    name = 'Cart1745259802594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cart" ("created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "count" integer NOT NULL DEFAULT '0', "user_id" uuid NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "UQ_ade06d2b5be46f088e1aa421dab" UNIQUE ("user_id", "product_id"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_f091e86a234693a49084b4c2c86" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_dccd1ec2d6f5644a69adf163bc1" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_dccd1ec2d6f5644a69adf163bc1"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_f091e86a234693a49084b4c2c86"`);
        await queryRunner.query(`DROP TABLE "cart"`);
    }

}
