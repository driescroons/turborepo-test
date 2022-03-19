import { Migration } from "@mikro-orm/migrations";

export class Migration20220310172739 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "comment" drop constraint if exists "comment_upvotes_check";'
    );
    this.addSql(
      'alter table "comment" alter column "upvotes" type int using ("upvotes"::int);'
    );
    this.addSql('alter table "comment" alter column "upvotes" set default 0;');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "comment" drop constraint if exists "comment_upvotes_check";'
    );
    this.addSql('alter table "comment" alter column "upvotes" drop default;');
    this.addSql(
      'alter table "comment" alter column "upvotes" type int using ("upvotes"::int);'
    );
  }
}
