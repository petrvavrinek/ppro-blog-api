import { MigrationInterface, QueryRunner } from "typeorm";

export class PostTagManyToManyFix1705755080147 implements MigrationInterface {
    name = 'PostTagManyToManyFix1705755080147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_tags_post_tag" ("postId" integer NOT NULL, "postTagId" integer NOT NULL, CONSTRAINT "PK_456b12978fbd8ace1fae5681d68" PRIMARY KEY ("postId", "postTagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e829cb7cb9ceda7bf10a619173" ON "post_tags_post_tag" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c197085a16d490ef1bf1d93472" ON "post_tags_post_tag" ("postTagId") `);
        await queryRunner.query(`ALTER TABLE "post_tags_post_tag" ADD CONSTRAINT "FK_e829cb7cb9ceda7bf10a6191730" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_tags_post_tag" ADD CONSTRAINT "FK_c197085a16d490ef1bf1d934727" FOREIGN KEY ("postTagId") REFERENCES "post_tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_tags_post_tag" DROP CONSTRAINT "FK_c197085a16d490ef1bf1d934727"`);
        await queryRunner.query(`ALTER TABLE "post_tags_post_tag" DROP CONSTRAINT "FK_e829cb7cb9ceda7bf10a6191730"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c197085a16d490ef1bf1d93472"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e829cb7cb9ceda7bf10a619173"`);
        await queryRunner.query(`DROP TABLE "post_tags_post_tag"`);
    }

}
