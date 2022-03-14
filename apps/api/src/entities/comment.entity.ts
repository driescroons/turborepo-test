import { Entity, Property } from "@mikro-orm/core";
import { Base } from "./base.entity";

@Entity()
export class Comment extends Base {
  @Property()
  public text!: string;

  @Property()
  public author!: string;

  // used to select a random image and author name
  @Property()
  public seed: string;

  @Property({ default: 0 })
  public upvotes: number = 0;
}
