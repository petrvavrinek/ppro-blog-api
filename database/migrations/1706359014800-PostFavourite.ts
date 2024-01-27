import { MigrationInterface, QueryRunner } from "typeorm";

export class PostFavourite1706359014800 implements MigrationInterface {
    name = 'PostFavourite1706359014800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_favourite" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "postId" integer, CONSTRAINT "PK_0c94843a076d46a4c65d5f38643" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post_favourite" ADD CONSTRAINT "FK_d280397eb3249b5c174c5593e99" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_favourite" ADD CONSTRAINT "FK_b128ea358ed9af25538d62844db" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_favourite" DROP CONSTRAINT "FK_b128ea358ed9af25538d62844db"`);
        await queryRunner.query(`ALTER TABLE "post_favourite" DROP CONSTRAINT "FK_d280397eb3249b5c174c5593e99"`);
        await queryRunner.query(`DROP TABLE "post_favourite"`);
    }

}
