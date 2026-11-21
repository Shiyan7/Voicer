import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatThreadPinned1794300000000 implements MigrationInterface {
  name = 'ChatThreadPinned1794300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_threads" ADD "pinnedAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_threads" DROP COLUMN "pinnedAt"`,
    );
  }
}
