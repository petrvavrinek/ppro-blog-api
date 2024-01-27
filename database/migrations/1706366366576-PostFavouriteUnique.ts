import { MigrationInterface, QueryRunner } from "typeorm";

export class PostFavouriteUnique1706366366576 implements MigrationInterface {
    name = 'PostFavouriteUnique1706366366576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_favourite" ADD CONSTRAINT "post-user" UNIQUE ("userId", "postId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_favourite" DROP CONSTRAINT "post-user"`);
    }

}
