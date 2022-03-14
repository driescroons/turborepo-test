import { Migration } from "@mikro-orm/migrations";

export class Migration20220314190101 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "comment" add column "seed" varchar(255) not null;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" drop column "seed";');
  }
}
