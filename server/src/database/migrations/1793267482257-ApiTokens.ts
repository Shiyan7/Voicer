import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApiTokens1793267482257 implements MigrationInterface {
  name = 'ApiTokens1793267482257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "api_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "name" character varying(100) NOT NULL, "tokenHash" character varying(64) NOT NULL, "lastUsedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c587455266b5fa8dace7194caac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2a2ce819bd75cc0193bfb2692b" ON "api_tokens" ("userId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_cdac8e064e6e9c2e0835d1c1b8" ON "api_tokens" ("tokenHash") `,
    );
    await queryRunner.query(
      `ALTER TABLE "api_tokens" ADD CONSTRAINT "FK_2a2ce819bd75cc0193bfb2692bd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "api_tokens" DROP CONSTRAINT "FK_2a2ce819bd75cc0193bfb2692bd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cdac8e064e6e9c2e0835d1c1b8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2a2ce819bd75cc0193bfb2692b"`,
    );
    await queryRunner.query(`DROP TABLE "api_tokens"`);
  }
}
