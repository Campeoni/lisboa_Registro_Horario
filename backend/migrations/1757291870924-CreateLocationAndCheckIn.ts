import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLocationAndCheckIn1757291870924 implements MigrationInterface {
    name = 'CreateLocationAndCheckIn1757291870924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "check_in" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "locationId" uuid NOT NULL, "type" character varying NOT NULL DEFAULT 'in', "meta" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c026e16735aea10812a3888d6c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "address" character varying, "latitude" numeric(10,7), "longitude" numeric(10,7), "geofenceRadiusMeters" integer NOT NULL DEFAULT '50', "isActive" boolean NOT NULL DEFAULT true, "meta" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_50d67b2c22be390e74257516ab8" UNIQUE ("code"), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "location_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "locationId" uuid NOT NULL, "roleInLocation" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba3b695bc9d4bd35cc12839507f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "check_in" ADD CONSTRAINT "FK_bf6f31f3f4c20b7cd20b6e674f6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "check_in" ADD CONSTRAINT "FK_f76b31fd9e3a9d05f414d8ec53a" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location_user" ADD CONSTRAINT "FK_a5ae1d64a06e1d6bd22d981405b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location_user" ADD CONSTRAINT "FK_846f6ac16b4787352730f112697" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location_user" DROP CONSTRAINT "FK_846f6ac16b4787352730f112697"`);
        await queryRunner.query(`ALTER TABLE "location_user" DROP CONSTRAINT "FK_a5ae1d64a06e1d6bd22d981405b"`);
        await queryRunner.query(`ALTER TABLE "check_in" DROP CONSTRAINT "FK_f76b31fd9e3a9d05f414d8ec53a"`);
        await queryRunner.query(`ALTER TABLE "check_in" DROP CONSTRAINT "FK_bf6f31f3f4c20b7cd20b6e674f6"`);
        await queryRunner.query(`DROP TABLE "location_user"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP TABLE "check_in"`);
    }

}
