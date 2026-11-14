import { MigrationInterface, QueryRunner } from 'typeorm';

export class MeetingScreenshotsAndTurnImage1794100000000 implements MigrationInterface {
  name = 'MeetingScreenshotsAndTurnImage1794100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "meeting_screenshots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "meetingId" uuid NOT NULL, "offsetMs" integer NOT NULL, "url" character varying NOT NULL, "thumbUrl" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_meeting_screenshots_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_meeting_screenshots_meeting_offset" ON "meeting_screenshots" ("meetingId", "offsetMs")`,
    );
    await queryRunner.query(
      `ALTER TABLE "meeting_screenshots" ADD CONSTRAINT "FK_meeting_screenshots_meeting" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "interview_turns" ADD "imageUrl" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview_turns" DROP COLUMN "imageUrl"`,
    );
    await queryRunner.query(`DROP TABLE "meeting_screenshots"`);
  }
}
