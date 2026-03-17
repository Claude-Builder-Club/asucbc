import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const createDatabase = (connectionString: string) => {
  const client = postgres(connectionString, {
    prepare: false,
  });

  return drizzle(client, { schema });
};

type Database = ReturnType<typeof createDatabase>;

let database: Database | null = null;

export const getDb = (): Database => {
  if (database) {
    return database;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  database = createDatabase(connectionString);
  return database;
};
