import { Migration } from "@mikro-orm/migrations";

export class Migration20220315204943 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "comment" add column "parent_uuid" varchar(255) null;'
    );
    this.addSql(
      'alter table "comment" add constraint "comment_parent_uuid_foreign" foreign key ("parent_uuid") references "comment" ("uuid") on update cascade on delete set null;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "comment" drop constraint "comment_parent_uuid_foreign";'
    );

    this.addSql('alter table "comment" drop column "parent_uuid";');
  }
}
