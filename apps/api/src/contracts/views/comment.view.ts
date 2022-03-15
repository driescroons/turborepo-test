import { Exclude, Expose, Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

@Exclude()
export class CommentView {
  @Expose()
  @IsUUID()
  public uuid: string;

  @Expose()
  @IsString()
  public author: string;

  @Expose()
  @IsString()
  public seed: string;

  @Expose()
  @IsDateString()
  public createdAt: string;

  @Expose()
  @ValidateNested({
    each: true,
    context: CommentView,
  })
  @Type(() => CommentView)
  @IsArray()
  public children: CommentView[];

  @Expose()
  @IsNumber()
  public upvotes: number;

  @Expose()
  @IsString()
  public text: string;
}
