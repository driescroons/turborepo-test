import { Migration } from '@mikro-orm/migrations';

export class Migration20220310164647 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "comment" ("uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "text" varchar(255) not null, "author" varchar(255) not null, "upvotes" int not null);');
    this.addSql('alter table "comment" add constraint "comment_pkey" primary key ("uuid");');
  }

}
