import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

const config: Options<PostgreSqlDriver> = {
  entities: ["./dist/entities"],
  entitiesTs: ["./src/entities"],
  migrations: {
    path: "./dist/migrations",
    pathTs: "./src/migrations",
  },
  dbName: "postgres",
  user: "postgres",
  password: "postgres",
  type: "postgresql",
};

export default config;
