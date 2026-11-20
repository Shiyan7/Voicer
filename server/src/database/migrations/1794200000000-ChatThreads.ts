import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatThreads1794200000000 implements MigrationInterface {
  name = 'ChatThreads1794200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chat_threads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "meetingId" uuid, "title" character varying(255), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_chat_threads_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_chat_threads_user_updated" ON "chat_threads" ("userId", "updatedAt")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_chat_threads_meeting" ON "chat_threads" ("meetingId") WHERE "meetingId" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_threads" ADD CONSTRAINT "FK_chat_threads_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_threads" ADD CONSTRAINT "FK_chat_threads_meeting" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `INSERT INTO "chat_threads" ("userId", "meetingId", "createdAt", "updatedAt") SELECT "meetings"."userId", "meetings"."id", MIN("messages"."createdAt"), MAX("messages"."createdAt") FROM "meeting_chat_messages" "messages" INNER JOIN "meetings" ON "meetings"."id" = "messages"."meetingId" GROUP BY "meetings"."id", "meetings"."userId"`,
    );

    await queryRunner.query(
      `ALTER TABLE "meeting_chat_messages" RENAME TO "chat_messages"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."meeting_chat_messages_role_enum" RENAME TO "chat_messages_role_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" RENAME CONSTRAINT "PK_bdd1532ec2323d580c9257fd3c6" TO "PK_chat_messages_id"`,
    );
    await queryRunner.query(`ALTER TABLE "chat_messages" ADD "threadId" uuid`);
    await queryRunner.query(
      `UPDATE "chat_messages" SET "threadId" = "chat_threads"."id" FROM "chat_threads" WHERE "chat_threads"."meetingId" = "chat_messages"."meetingId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ALTER COLUMN "threadId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_be988e6375b7e5da4058ea10d4c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8ce7b9fcc29e425715a981a393"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP COLUMN "meetingId"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_chat_messages_thread_created" ON "chat_messages" ("threadId", "createdAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_chat_messages_thread" FOREIGN KEY ("threadId") REFERENCES "chat_threads"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_chat_messages_thread"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_chat_messages_thread_created"`,
    );
    await queryRunner.query(`ALTER TABLE "chat_messages" ADD "meetingId" uuid`);
    await queryRunner.query(
      `UPDATE "chat_messages" SET "meetingId" = "chat_threads"."meetingId" FROM "chat_threads" WHERE "chat_threads"."id" = "chat_messages"."threadId"`,
    );
    await queryRunner.query(
      `DELETE FROM "chat_messages" WHERE "meetingId" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ALTER COLUMN "meetingId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP COLUMN "threadId"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8ce7b9fcc29e425715a981a393" ON "chat_messages" ("meetingId", "createdAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_be988e6375b7e5da4058ea10d4c" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" RENAME CONSTRAINT "PK_chat_messages_id" TO "PK_bdd1532ec2323d580c9257fd3c6"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."chat_messages_role_enum" RENAME TO "meeting_chat_messages_role_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" RENAME TO "meeting_chat_messages"`,
    );
    await queryRunner.query(`DROP TABLE "chat_threads"`);
  }
}
