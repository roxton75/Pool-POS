import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { databaseSchema } from "./schema";
import { databaseMigrations } from "./migrations";
import { modelClasses } from "./models";

const adapter = new SQLiteAdapter({
  schema: databaseSchema,
  migrations: databaseMigrations,
  dbName: "qzone-watermelon",
  jsi: false,
  onSetUpError: (error) => {
    console.error("[WatermelonDB] Setup failed:", error);
  },
});

export const database = new Database({
  adapter,
  modelClasses,
});
