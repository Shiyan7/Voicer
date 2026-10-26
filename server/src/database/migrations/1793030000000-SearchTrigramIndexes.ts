import { MigrationInterface, QueryRunner } from 'typeorm';

export class SearchTrigramIndexes1793030000000 implements MigrationInterface {
  name = 'SearchTrigramIndexes1793030000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_transcript_segments_text_trgm" ON "transcript_segments" USING gin ("text" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_key_points_text_trgm" ON "key_points" USING gin ("text" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_action_items_text_trgm" ON "action_items" USING gin ("text" gin_trgm_ops)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_action_items_text_trgm"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_key_points_text_trgm"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_transcript_segments_text_trgm"`,
    );
  }
}
