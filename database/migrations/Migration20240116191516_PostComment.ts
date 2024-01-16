import { Migration } from '@mikro-orm/migrations';

export class Migration20240116191516_PostComment extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post_comment" ("id" serial primary key, "content" text not null, "author_id" int not null, "post_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);');

    this.addSql('alter table "post_comment" add constraint "post_comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "post_comment" add constraint "post_comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "post_comment" cascade;');
  }

}
