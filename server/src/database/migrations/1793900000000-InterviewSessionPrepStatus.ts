import { MigrationInterface, QueryRunner } from 'typeorm';

export class InterviewSessionPrepStatus1793900000000 implements MigrationInterface {
  name = 'InterviewSessionPrepStatus1793900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" ADD "prepStatus" character varying NOT NULL DEFAULT 'ready'`,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" ADD "resumeFileName" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" DROP COLUMN "resumeFileName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" DROP COLUMN "prepStatus"`,
    );
  }
}
