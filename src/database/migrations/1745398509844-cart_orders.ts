import { MigrationInterface, QueryRunner } from 'typeorm';

export class CartOrders1745398509844 implements MigrationInterface {
  name = 'CartOrders1745398509844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "orders_products" ("created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "count" integer NOT NULL, "price" integer NOT NULL, "product_id" uuid NOT NULL, "order_id" uuid NOT NULL, CONSTRAINT "PK_4945c6758fd65ffacda760b4ac9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_products" ("created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "count" integer NOT NULL DEFAULT '0', "product_id" uuid, "cart_id" uuid, CONSTRAINT "UQ_bcd1ff5a1d4f6ef4e3a00af6886" UNIQUE ("product_id", "cart_id"), CONSTRAINT "PK_3b12299e401712e78753a7b4fec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" ("created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, CONSTRAINT "UQ_f091e86a234693a49084b4c2c86" UNIQUE ("user_id"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'in_process', "user_id" uuid NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" ADD CONSTRAINT "FK_beb618ce6dae64b9d817394ebdb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" ADD CONSTRAINT "FK_266b0df20b9e4423bc9da1bbdc1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_products" ADD CONSTRAINT "FK_bb7910594db3f08cadeb6f484c1" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_products" ADD CONSTRAINT "FK_ebc4fe8eabf38786bb86cda0b9f" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_f091e86a234693a49084b4c2c86" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`,
    );
    await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_f091e86a234693a49084b4c2c86"`);
    await queryRunner.query(
      `ALTER TABLE "cart_products" DROP CONSTRAINT "FK_ebc4fe8eabf38786bb86cda0b9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_products" DROP CONSTRAINT "FK_bb7910594db3f08cadeb6f484c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" DROP CONSTRAINT "FK_266b0df20b9e4423bc9da1bbdc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" DROP CONSTRAINT "FK_beb618ce6dae64b9d817394ebdb"`,
    );
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "cart_products"`);
    await queryRunner.query(`DROP TABLE "orders_products"`);
  }
}
