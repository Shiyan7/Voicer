import { MigrationInterface, QueryRunner } from 'typeorm';

export class MeetingInterviewSession1793513742939 implements MigrationInterface {
  name = 'MeetingInterviewSession1793513742939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD "interviewSessionId" uuid`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_18e1b58fbbaea9fae1e2ec9b1e" ON "meetings" ("interviewSessionId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD CONSTRAINT "FK_18e1b58fbbaea9fae1e2ec9b1e3" FOREIGN KEY ("interviewSessionId") REFERENCES "interview_sessions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `UPDATE "meetings" m SET "interviewSessionId" = (SELECT s.id FROM "interview_sessions" s WHERE s."userId" = m."userId" AND s."createdAt" <= m."startedAt" AND (s."finishedAt" IS NULL OR s."finishedAt" >= m."startedAt") ORDER BY s."createdAt" DESC LIMIT 1)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP CONSTRAINT "FK_18e1b58fbbaea9fae1e2ec9b1e3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_18e1b58fbbaea9fae1e2ec9b1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP COLUMN "interviewSessionId"`,
    );
  }
}
