import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFingerprint1776215439204 implements MigrationInterface {
    name = 'CreateFingerprint1776215439204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fingerprint" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "type" character varying NOT NULL DEFAULT 'webauthn', "credential" text NOT NULL, "credentialId" text, "isActive" boolean NOT NULL DEFAULT true, "meta" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8f1c3d8326a0907d1c7a5961f32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "fingerprint" ADD CONSTRAINT "FK_a4b03b8f399ebf055b138ff4fc7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fingerprint" DROP CONSTRAINT "FK_a4b03b8f399ebf055b138ff4fc7"`);
        await queryRunner.query(`DROP TABLE "fingerprint"`);
    }

}
