import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { MikroORM, RequestContext } from "@mikro-orm/core";

import compression from "compression";
import express, { Application } from "express";
import "express-async-errors";
import helmet from "helmet";
import hpp from "hpp";
import { useExpressServer } from "routing-controllers";
import errorMiddleware from "./middlewares/error.middleware";
import ormConfig from "./orm.config";

// TODO: come from env variables
const port = 3000;

export class App {
  private orm: MikroORM;
  private server: Application;

  constructor(controllers: Function[]) {
    this.server = express();
    this.initMiddlewares();
    this.initControllers(controllers);
    this.initErrorMiddleware();
  }

  public listen() {
    this.server.listen(port, () => {
      console.log(`Listening on port ${port}, http://localhost:${port}`);
    });
  }

  public async initConnection() {
    this.orm = await MikroORM.init<PostgreSqlDriver>(ormConfig);
  }


  private initMiddlewares() {
    this.server.use(hpp());
    this.server.use(helmet());
    this.server.use(compression());
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use((_, __, next) => {
      RequestContext.create(this.orm.em, next);
    });
  }

  private initControllers = (controllers: Function[]) => {
    useExpressServer(this.server, {
      controllers: controllers,
      defaultErrorHandler: false,
    });
  };

  private initErrorMiddleware = () => {
    this.server.use(errorMiddleware);
  };
}
