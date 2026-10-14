import { MigrationInterface, QueryRunner } from 'typeorm';

// Файл создания заказа перевели на упрощённый флоу (без регистрации юзера и корзины — только phone).
// Позже планируется вернуться к полноценному флоу: убрать колонку phone и вернуть user_id NOT NULL.
export class AddPhoneAndNullableUserToOrders1750000000000 implements MigrationInterface {
  name = 'AddPhoneAndNullableUserToOrders1750000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" ADD "phone" character varying`);
    await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "user_id" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "orders" WHERE "user_id" IS NULL`);
    await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "user_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "phone"`);
  }
}
