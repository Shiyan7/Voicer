import { MigrationInterface, QueryRunner } from 'typeorm';

export class MeetingSummaryStyle1793099611260 implements MigrationInterface {
  name = 'MeetingSummaryStyle1793099611260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."meetings_summarystyle_enum" AS ENUM('auto', 'concise', 'detailed', 'bullets', 'casual', 'work', 'interview', 'advice')`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD "summaryStyle" "public"."meetings_summarystyle_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP COLUMN "summaryStyle"`,
    );
    await queryRunner.query(`DROP TYPE "public"."meetings_summarystyle_enum"`);
  }
}
