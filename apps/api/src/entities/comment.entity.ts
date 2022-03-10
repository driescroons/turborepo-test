import { Entity, Property } from "@mikro-orm/core";
import { Base } from "./base.entity";

@Entity()
export class Comment extends Base {
  @Property()
  public text!: string;

  @Property()
  public author!: string;

  @Property()
  public upvotes!: number;
}
