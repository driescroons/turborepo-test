import { NextFunction, Request, Response } from "express";
import { HttpError } from "../contracts/errors/http.error";

const errorMiddleware = (
  error: HttpError,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(error.httpCode || 500).send({
      message: error.message,
      ...(error.payload ? { payload: error.payload } : {}),
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
