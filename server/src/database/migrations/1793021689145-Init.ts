import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1793021689145 implements MigrationInterface {
  name = 'Init1793021689145';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying, "googleId" character varying, "avatar" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."meetings_status_enum" AS ENUM('recording', 'transcribing', 'transcribed', 'summarizing', 'ready', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "meetings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "title" character varying(255), "source" character varying, "audioUrl" character varying, "status" "public"."meetings_status_enum" NOT NULL DEFAULT 'recording', "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endedAt" TIMESTAMP WITH TIME ZONE, "durationSec" integer, "isFavorite" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_aa73be861afa77eb4ed31f3ed57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e05ceca0858a2369f5cf52be97" ON "meetings" ("userId", "startedAt", "id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "transcript_segments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "meetingId" uuid NOT NULL, "speakerIndex" integer NOT NULL, "startMs" integer NOT NULL, "endMs" integer NOT NULL, "text" text NOT NULL, CONSTRAINT "PK_34cfd4b54a9857af7dfa443f3ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9fd95e01d3b7cd6b732f7a7a7e" ON "transcript_segments" ("meetingId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "key_points" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "meetingId" uuid NOT NULL, "text" text NOT NULL, "atMs" integer, "order" integer NOT NULL, CONSTRAINT "PK_1fd08cedaca035016a16abebe1a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d5a4dd61b6352eefd399d9f8c6" ON "key_points" ("meetingId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "action_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "meetingId" uuid NOT NULL, "userId" uuid NOT NULL, "text" character varying NOT NULL, "isDone" boolean NOT NULL DEFAULT false, "speakerIndex" integer, "atMs" integer, "dueDate" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a84b168b001636b379312104ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a302ef11e140ef94e5ccb1c187" ON "action_items" ("meetingId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ac4983a291ece09f861fa2186e" ON "action_items" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD CONSTRAINT "FK_4b70ab8832f1d7f9a7387d14307" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transcript_segments" ADD CONSTRAINT "FK_9fd95e01d3b7cd6b732f7a7a7ee" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "key_points" ADD CONSTRAINT "FK_d5a4dd61b6352eefd399d9f8c63" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "action_items" ADD CONSTRAINT "FK_a302ef11e140ef94e5ccb1c1872" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "action_items" ADD CONSTRAINT "FK_ac4983a291ece09f861fa2186e6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "action_items" DROP CONSTRAINT "FK_ac4983a291ece09f861fa2186e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "action_items" DROP CONSTRAINT "FK_a302ef11e140ef94e5ccb1c1872"`,
    );
    await queryRunner.query(
      `ALTER TABLE "key_points" DROP CONSTRAINT "FK_d5a4dd61b6352eefd399d9f8c63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transcript_segments" DROP CONSTRAINT "FK_9fd95e01d3b7cd6b732f7a7a7ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP CONSTRAINT "FK_4b70ab8832f1d7f9a7387d14307"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ac4983a291ece09f861fa2186e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a302ef11e140ef94e5ccb1c187"`,
    );
    await queryRunner.query(`DROP TABLE "action_items"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d5a4dd61b6352eefd399d9f8c6"`,
    );
    await queryRunner.query(`DROP TABLE "key_points"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9fd95e01d3b7cd6b732f7a7a7e"`,
    );
    await queryRunner.query(`DROP TABLE "transcript_segments"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e05ceca0858a2369f5cf52be97"`,
    );
    await queryRunner.query(`DROP TABLE "meetings"`);
    await queryRunner.query(`DROP TYPE "public"."meetings_status_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
