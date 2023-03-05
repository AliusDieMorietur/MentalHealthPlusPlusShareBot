import nodePg from "node-pg-migrate";
const pgm = nodePg.default;

const CONFIG = {
  dir: "migrations",
  migrationsTable: "pgmigrations",
};

export const migrateUp = (databaseUrl, count = Infinity) =>
  pgm({
    ...CONFIG,
    databaseUrl,
    direction: "up",
    count,
  });
