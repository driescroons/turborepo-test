import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

const config: Options<PostgreSqlDriver> = {
  entities: ["./dist/entities"],
  entitiesTs: ["./src/entities"],
  migrations: {
    path: "./dist/migrations",
    pathTs: "./src/migrations",
    disableForeignKeys: false, // heroku config
  },
  type: "postgresql",
  ...(process.env.DATABASE_URL
    ? {
        // heroku config
        clientUrl: process.env.DATABASE_URL,
        driverOptions: {
          connection: { ssl: { rejectUnauthorized: false } },
        },
      }
    : {
        dbName: "postgres",
        user: "postgres",
        password: "postgres",
      }),
};

export default config;
