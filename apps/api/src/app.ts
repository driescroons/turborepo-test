import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { MikroORM, RequestContext } from "@mikro-orm/core";

import compression from "compression";
import express, { Application, Request } from "express";
import "express-async-errors";
import helmet from "helmet";
import hpp from "hpp";
import { useExpressServer } from "routing-controllers";
import errorMiddleware from "./middlewares/error.middleware";
import ormConfig from "./orm.config";
import fs from "fs-extra";
import path from "path";
import http from "http";
import { Server } from "socket.io";

// TODO: come from env variables
const port = 3000;

export class App {
  private orm: MikroORM;
  private app: Application;
  private server: http.Server;

  constructor(controllers: Function[]) {
    this.app = express();
    this.initStaticFiles();
    this.initMiddlewares();
    this.initSockets();
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
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use((_, __, next) => {
      RequestContext.create(this.orm.em, next);
    });
  }

  private initControllers = (controllers: Function[]) => {
    useExpressServer(this.app, {
      cors: true,
      controllers: controllers,
      defaultErrorHandler: false,
    });
  };

  private initErrorMiddleware = () => {
    this.app.use(errorMiddleware);
  };

  private initSockets = () => {
    this.server = http.createServer(this.app);
    const io = new Server(this.server, { cors: true } as any);

    this.app.use((req, _, next) => {
      // TODO: add to types
      (req as Request & { io: Server }).io = io;
      next();
    });
  };
}
