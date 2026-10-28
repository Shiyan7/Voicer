import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUnusedFields1793158887103 implements MigrationInterface {
  name = 'RemoveUnusedFields1793158887103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "googleId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    await queryRunner.query(`ALTER TABLE "action_items" DROP COLUMN "dueDate"`);
    await queryRunner.query(
      `ALTER TYPE "public"."meetings_status_enum" RENAME TO "meetings_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."meetings_status_enum" AS ENUM('transcribing', 'transcribed', 'summarizing', 'ready', 'failed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" ALTER COLUMN "status" TYPE "public"."meetings_status_enum" USING "status"::"text"::"public"."meetings_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."meetings_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."meetings_status_enum_old" AS ENUM('recording', 'transcribing', 'transcribed', 'summarizing', 'ready', 'failed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" ALTER COLUMN "status" TYPE "public"."meetings_status_enum_old" USING "status"::"text"::"public"."meetings_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" ALTER COLUMN "status" SET DEFAULT 'recording'`,
    );
    await queryRunner.query(`DROP TYPE "public"."meetings_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."meetings_status_enum_old" RENAME TO "meetings_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "action_items" ADD "dueDate" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatar" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "googleId" character varying`,
    );
  }
}
