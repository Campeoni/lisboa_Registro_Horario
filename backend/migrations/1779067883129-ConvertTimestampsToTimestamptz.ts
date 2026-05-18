import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertTimestampsToTimestamptz1779067883129
  implements MigrationInterface
{
  name = 'ConvertTimestampsToTimestamptz1779067883129';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Convert all TIMESTAMP (without tz) to TIMESTAMPTZ (with tz)
    // USING clause tells PostgreSQL to interpret stored values as UTC-3
    // (the timezone they were originally generated in)
    await queryRunner.query(
      `ALTER TABLE "check_in" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt" AT TIME ZONE '-3'`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt" AT TIME ZONE '-3'`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ USING "updatedAt" AT TIME ZONE '-3'`,
    );
    await queryRunner.query(
      `ALTER TABLE "location_user" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt" AT TIME ZONE '-3'`,
    );
    await queryRunner.query(
      `ALTER TABLE "fingerprint" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt" AT TIME ZONE '-3'`,
    );
    await queryRunner.query(
      `ALTER TABLE "fingerprint" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ USING "updatedAt" AT TIME ZONE '-3'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt" AT TIME ZONE '-3'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ USING "updatedAt" AT TIME ZONE '-3'`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt" AT TIME ZONE '-3'`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ USING "updatedAt" AT TIME ZONE '-3'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt" AT TIME ZONE '-3'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert: TIMESTAMPTZ → TIMESTAMP (drops timezone info, keeps local time in session tz)
    await queryRunner.query(
      `ALTER TABLE "check_in" ALTER COLUMN "createdAt" TYPE TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "createdAt" TYPE TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "location_user" ALTER COLUMN "createdAt" TYPE TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "fingerprint" ALTER COLUMN "createdAt" TYPE TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "fingerprint" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "createdAt" TYPE TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ALTER COLUMN "createdAt" TYPE TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ALTER COLUMN "createdAt" TYPE TIMESTAMP`,
    );
  }
}
