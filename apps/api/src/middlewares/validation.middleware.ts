import { ClassConstructor, plainToInstance } from "class-transformer";
import { ValidatorOptions } from "class-validator";
import { NextFunction, Request, Response } from "express";
import validator from "../utils/validator";

export type validationTypes = "body" | "query" | "params";

const validationMiddleware = (
  type: ClassConstructor<object>,
  value: validationTypes = "body",
  options: ValidatorOptions = {}
) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    const input = plainToInstance(type, req[value as validationTypes]);
    await validator(input, value, {
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
      ...options,
    });

    req[value] = input;
    next();
  };
};

export default validationMiddleware;
