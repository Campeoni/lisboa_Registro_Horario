import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGeolocationToCheckIn1778891308470 implements MigrationInterface {
    name = 'AddGeolocationToCheckIn1778891308470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "check_in" ADD "lat" numeric(10,7)`);
        await queryRunner.query(`ALTER TABLE "check_in" ADD "lng" numeric(10,7)`);
        await queryRunner.query(`ALTER TABLE "check_in" ADD "accuracy" integer`);
        await queryRunner.query(`ALTER TABLE "check_in" ADD "ip" character varying`);
        await queryRunner.query(`ALTER TABLE "check_in" ADD "validated" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "check_in" ADD "distanceMeters" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "check_in" DROP COLUMN "distanceMeters"`);
        await queryRunner.query(`ALTER TABLE "check_in" DROP COLUMN "validated"`);
        await queryRunner.query(`ALTER TABLE "check_in" DROP COLUMN "ip"`);
        await queryRunner.query(`ALTER TABLE "check_in" DROP COLUMN "accuracy"`);
        await queryRunner.query(`ALTER TABLE "check_in" DROP COLUMN "lng"`);
        await queryRunner.query(`ALTER TABLE "check_in" DROP COLUMN "lat"`);
    }

}
