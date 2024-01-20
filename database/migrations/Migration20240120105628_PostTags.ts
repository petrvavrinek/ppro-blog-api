import { Migration } from '@mikro-orm/migrations';

export class Migration20240120105628_PostTags extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post_tag" ("id" serial primary key, "name" varchar(40) not null);');
    this.addSql('create index "post_tag_name_index" on "post_tag" ("name");');
    this.addSql('alter table "post_tag" add constraint "post_tag_name_unique" unique ("name");');

    this.addSql('create table "post_tags" ("post_id" int not null, "post_tag_id" int not null, constraint "post_tags_pkey" primary key ("post_id", "post_tag_id"));');

    this.addSql('alter table "post_tags" add constraint "post_tags_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "post_tags" add constraint "post_tags_post_tag_id_foreign" foreign key ("post_tag_id") references "post_tag" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post_tags" drop constraint "post_tags_post_tag_id_foreign";');

    this.addSql('drop table if exists "post_tag" cascade;');

    this.addSql('drop table if exists "post_tags" cascade;');
  }

}
