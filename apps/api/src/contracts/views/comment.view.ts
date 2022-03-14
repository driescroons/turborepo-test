import { Exclude, Expose } from "class-transformer";
import { IsDateString, IsNumber, IsString, IsUUID } from "class-validator";

@Exclude()
export class CommentView {
  @Expose()
  @IsUUID()
  public uuid: string;

  @Expose()
  @IsString()
  public author: string;

  @Expose()
  @IsDateString()
  public createdAt: string;

  @Expose()
  @IsNumber()
  public upvotes: number;

  @Expose()
  @IsString()
  public text: string;
}
