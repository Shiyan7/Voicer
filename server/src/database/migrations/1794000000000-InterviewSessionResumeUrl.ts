import { MigrationInterface, QueryRunner } from 'typeorm';

export class InterviewSessionResumeUrl1794000000000 implements MigrationInterface {
  name = 'InterviewSessionResumeUrl1794000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" ADD "resumeUrl" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" DROP COLUMN "resumeUrl"`,
    );
  }
}
