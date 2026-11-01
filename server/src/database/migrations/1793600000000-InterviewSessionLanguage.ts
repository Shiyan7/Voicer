import { MigrationInterface, QueryRunner } from 'typeorm';

export class InterviewSessionLanguage1793600000000 implements MigrationInterface {
  name = 'InterviewSessionLanguage1793600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" ADD "language" character varying NOT NULL DEFAULT 'ru'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" DROP COLUMN "language"`,
    );
  }
}
