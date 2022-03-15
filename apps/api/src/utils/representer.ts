import { ClassConstructor, plainToInstance } from "class-transformer";
import { Action } from "routing-controllers";

import { plainToClass } from "class-transformer";
import {
  createListRepresentation,
  ListRepresentation,
} from "../contracts/views/list.view";

export const representer =
  <T>(representationType: ClassConstructor<T>) =>
  (_: Action, content: any) => {
    return plainToInstance(representationType, content.toJSON?.() ?? content, {
      exposeUnsetFields: false,
    });
  };

export const listRepresenter =
  <T>(representationType: ClassConstructor<T>) =>
  (_: Action, content: [any[], number]) => {
    const [items, count] = content;
    const objects = items.map((item) => item.toJSON?.() ?? item);
    const representation = new ListRepresentation(count, objects);
    const listRepresentation = createListRepresentation(representationType);
    return plainToInstance(listRepresentation, representation, {
      exposeUnsetFields: false,
    });
  };
