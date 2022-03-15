import { Exclude, Expose } from "class-transformer";
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

@Exclude()
export class CommentBody {
  @Expose()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  public text: string;

  @Expose()
  @IsString()
  public seed: string;

  @Expose()
  @IsUUID()
  @IsOptional()
  public parent?: string;
}
