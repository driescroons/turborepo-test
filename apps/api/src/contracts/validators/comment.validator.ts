import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class CommentValidator {
  @Expose()
  @IsString()
  public text: string;
}
