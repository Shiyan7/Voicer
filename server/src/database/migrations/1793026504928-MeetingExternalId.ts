import { MigrationInterface, QueryRunner } from 'typeorm';

export class MeetingExternalId1793026504928 implements MigrationInterface {
  name = 'MeetingExternalId1793026504928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD "externalSource" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD "externalId" character varying`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a40af7e05a4a3443a5b038ed52" ON "meetings" ("userId", "externalSource", "externalId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a40af7e05a4a3443a5b038ed52"`,
    );
    await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "externalId"`);
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP COLUMN "externalSource"`,
    );
  }
}
