import { MigrationInterface, QueryRunner } from 'typeorm';

export class InterviewSessionTitle1793700000000 implements MigrationInterface {
  name = 'InterviewSessionTitle1793700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" ADD "title" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" DROP COLUMN "title"`,
    );
  }
}
