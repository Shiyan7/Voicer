import { MigrationInterface, QueryRunner } from 'typeorm';

export class InterviewSessionRecommendationsNullable1794000000000 implements MigrationInterface {
  name = 'InterviewSessionRecommendationsNullable1794000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" ALTER COLUMN "recommendations" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "interview_sessions" SET "recommendations" = '{"topics":[],"likelyQuestions":[],"emphasize":[]}' WHERE "recommendations" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_sessions" ALTER COLUMN "recommendations" SET NOT NULL`,
    );
  }
}
