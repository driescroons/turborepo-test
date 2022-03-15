import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString, IsUUID } from "class-validator";

@Exclude()
export class CommentBody {
  @Expose()
  @IsString()
  public text: string;

  @Expose()
  @IsString()
  public seed: string;

  @Expose()
  @IsUUID()
  @IsOptional()
  public parent?: string;
}
