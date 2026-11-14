import { MigrationInterface, QueryRunner } from 'typeorm';

export class MeetingScreenshotThumb1794200000000 implements MigrationInterface {
  name = 'MeetingScreenshotThumb1794200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meeting_screenshots" ADD "thumbUrl" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meeting_screenshots" DROP COLUMN "thumbUrl"`,
    );
  }
}
