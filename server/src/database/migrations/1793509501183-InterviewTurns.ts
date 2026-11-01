import { MigrationInterface, QueryRunner } from 'typeorm';

export class InterviewTurns1793509501183 implements MigrationInterface {
  name = 'InterviewTurns1793509501183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "interview_turns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionId" uuid NOT NULL, "question" text NOT NULL, "answer" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_70e3c05e2e1d0467f212537af7b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e7828fcb8808b5d2c2c748008a" ON "interview_turns" ("sessionId", "createdAt") `,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" ADD "recordingStartedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" ADD "finishedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_turns" ADD CONSTRAINT "FK_cf3fec84acb8aa938210dc9c0b3" FOREIGN KEY ("sessionId") REFERENCES "interview_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_turns" DROP CONSTRAINT "FK_cf3fec84acb8aa938210dc9c0b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" DROP COLUMN "finishedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" DROP COLUMN "recordingStartedAt"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e7828fcb8808b5d2c2c748008a"`,
    );
    await queryRunner.query(`DROP TABLE "interview_turns"`);
  }
}
