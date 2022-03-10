import { HttpError as RoutingControllersError } from "routing-controllers";

export class HttpError extends RoutingControllersError {
  public payload?: object;

  constructor(status: number, message: string, payload?: object) {
    super(status, message);
    this.payload = payload;
  }
}
