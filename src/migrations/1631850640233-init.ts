import {MigrationInterface, QueryRunner} from "typeorm";

export class init1631850640233 implements MigrationInterface {
    name = 'init1631850640233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "firts_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "money" integer, "role_id" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchases" ("id" SERIAL NOT NULL, "purchased_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "total" integer NOT NULL, "user_id" integer, CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchases_products" ("id" SERIAL NOT NULL, "product_id" integer, "purchase_id" integer, CONSTRAINT "PK_5170db511572341dc093ed4adc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "products_category_enum" AS ENUM('Food', 'Technology', 'Games')`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "category" "products_category_enum" NOT NULL, "price" integer NOT NULL, "quantity_stock" integer NOT NULL, CONSTRAINT "UQ_4c9fb58de893725258746385e16" UNIQUE ("name"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_024ddf7e04177a07fcb9806a90a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases_products" ADD CONSTRAINT "FK_e54c9a434e453a25cf998a9450b" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases_products" ADD CONSTRAINT "FK_32b6e478da3f612119ae05b3ab0" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases_products" DROP CONSTRAINT "FK_32b6e478da3f612119ae05b3ab0"`);
        await queryRunner.query(`ALTER TABLE "purchases_products" DROP CONSTRAINT "FK_e54c9a434e453a25cf998a9450b"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_024ddf7e04177a07fcb9806a90a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "products_category_enum"`);
        await queryRunner.query(`DROP TABLE "purchases_products"`);
        await queryRunner.query(`DROP TABLE "purchases"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
