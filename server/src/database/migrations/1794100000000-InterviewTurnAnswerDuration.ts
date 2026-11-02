import { MigrationInterface, QueryRunner } from 'typeorm';

export class InterviewTurnAnswerDuration1794100000000 implements MigrationInterface {
  name = 'InterviewTurnAnswerDuration1794100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_turns" ADD "answerDurationMs" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_turns" DROP COLUMN "answerDurationMs"`,
    );
  }
}
