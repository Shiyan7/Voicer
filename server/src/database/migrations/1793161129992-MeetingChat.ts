import { MigrationInterface, QueryRunner } from 'typeorm';

export class MeetingChat1793161129992 implements MigrationInterface {
  name = 'MeetingChat1793161129992';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."meeting_chat_messages_role_enum" AS ENUM('user', 'assistant')`,
    );
    await queryRunner.query(
      `CREATE TABLE "meeting_chat_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "meetingId" uuid NOT NULL, "role" "public"."meeting_chat_messages_role_enum" NOT NULL, "content" text NOT NULL DEFAULT '', "followUps" jsonb NOT NULL DEFAULT '[]', "isFailed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bdd1532ec2323d580c9257fd3c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8ce7b9fcc29e425715a981a393" ON "meeting_chat_messages" ("meetingId", "createdAt") `,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD "suggestedQuestions" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "meeting_chat_messages" ADD CONSTRAINT "FK_be988e6375b7e5da4058ea10d4c" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meeting_chat_messages" DROP CONSTRAINT "FK_be988e6375b7e5da4058ea10d4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP COLUMN "suggestedQuestions"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8ce7b9fcc29e425715a981a393"`,
    );
    await queryRunner.query(`DROP TABLE "meeting_chat_messages"`);
    await queryRunner.query(
      `DROP TYPE "public"."meeting_chat_messages_role_enum"`,
    );
  }
}
