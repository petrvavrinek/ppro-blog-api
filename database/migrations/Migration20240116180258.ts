import { Migration } from '@mikro-orm/migrations';

export class Migration20240116180258 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "username" varchar(60) not null, "password" varchar(255) not null);');

    this.addSql('create table "post" ("id" serial primary key, "slug" varchar(60) not null, "title" varchar(150) not null, "content" text not null, "author_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);');
    this.addSql('create index "post_slug_index" on "post" ("slug");');

    this.addSql('alter table "post" add constraint "post_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
  }

}
