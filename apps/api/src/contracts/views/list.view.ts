import { ClassConstructor, Exclude, Expose, Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";

export class ListRepresentation<T> {
  public count: number;
  public items: T[];

  constructor(count: number, items: T[]) {
    this.count = count;
    this.items = items;
  }
}

export const createListRepresentation = <T>(
  type: ClassConstructor<T>
): ClassConstructor<ListRepresentation<T>> => {
  const name = `${type.name}ListRepresentation`;

  @Exclude()
  class ListRepresentationFactory {
    @Expose()
    @IsNumber()
    public count: number;

    @Expose()
    @ValidateNested({
      each: true,
      context: type,
    })
    @Type(() => type)
    @IsArray()
    public items: T[];
  }

  Object.defineProperty(ListRepresentationFactory, "name", { value: name });

  return ListRepresentationFactory;
};
