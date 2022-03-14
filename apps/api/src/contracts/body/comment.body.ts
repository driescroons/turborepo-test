import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class CommentBody {
  @Expose()
  @IsString()
  public text: string;

  @Expose()
  @IsString()
  public seed: string;
}
