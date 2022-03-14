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
import fs from "fs-extra";
import path from "path";

// TODO: come from env variables
const port = 3000;

export class App {
  private orm: MikroORM;
  private server: Application;

  constructor(controllers: Function[]) {
    this.server = express();
    this.initStaticFiles();
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
    const migrator = this.orm.getMigrator();
    const pendingMigrations = await migrator.getPendingMigrations();
    if (pendingMigrations.length > 0) {
      migrator.up();
    }
  }

  private initStaticFiles() {
    fs.copySync(
      path.resolve(__dirname, "../../app/dist"),
      path.resolve(__dirname, "../static"),
      { overwrite: true }
    );
    this.server.use(express.static(path.resolve(__dirname, "../static")));
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
