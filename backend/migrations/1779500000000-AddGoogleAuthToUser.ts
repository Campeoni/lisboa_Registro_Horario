import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGoogleAuthToUser1779500000000 implements MigrationInterface {
  name = 'AddGoogleAuthToUser1779500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make password nullable
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`,
    );
    // Add googleId column
    await queryRunner.query(
      `ALTER TABLE "user" ADD "googleId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_user_googleId" UNIQUE ("googleId")`,
    );
    // Add provider column with default 'local'
    await queryRunner.query(
      `ALTER TABLE "user" ADD "provider" character varying NOT NULL DEFAULT 'local'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_user_googleId"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "provider"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleId"`);
    // Restore password NOT NULL (fails if any google-only users exist)
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`,
    );
  }
}
