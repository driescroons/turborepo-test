import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { MikroORM, RequestContext } from "@mikro-orm/core";

import express, { Application } from "express";
import "express-async-errors";
import { useExpressServer } from "routing-controllers";
import ormConfig from "./orm.config";

// TODO: come from env variables
const port = 3000;

export class App {
  private orm: MikroORM;
  private server: Application;

  constructor(controllers: Function[]) {
    this.server = express();
    this.initControllers(controllers);
  }

  public listen() {
    this.server.listen(port, () => {
      console.log(`Listening on port ${port}, http://localhost:${port}`);
    });
  }

  public async initConnection() {
    this.orm = await MikroORM.init<PostgreSqlDriver>(ormConfig);
  }

}
