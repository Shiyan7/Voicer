import { MigrationInterface, QueryRunner } from 'typeorm';

export class InterviewSessionMode1793800000000 implements MigrationInterface {
  name = 'InterviewSessionMode1793800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" ADD "mode" character varying NOT NULL DEFAULT 'real'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" DROP COLUMN "mode"`,
    );
  }
}
