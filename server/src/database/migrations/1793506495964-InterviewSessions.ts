import { MigrationInterface, QueryRunner } from 'typeorm';

export class InterviewSessions1793506495964 implements MigrationInterface {
  name = 'InterviewSessions1793506495964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "interview_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "resumeText" text NOT NULL DEFAULT '', "vacancyText" text NOT NULL DEFAULT '', "cheatSheet" text NOT NULL DEFAULT '', "recommendations" jsonb NOT NULL, "styleSamples" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8289f4ee665d0b5e283345db49a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4cc3eb59674f29876daf51609c" ON "interview_sessions" ("userId", "createdAt") `,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" ADD CONSTRAINT "FK_983f98d1377ff1879132a17e8d9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" DROP CONSTRAINT "FK_983f98d1377ff1879132a17e8d9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4cc3eb59674f29876daf51609c"`,
    );
    await queryRunner.query(`DROP TABLE "interview_sessions"`);
  }
}
