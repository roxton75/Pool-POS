import {
  createContext, useContext, useEffect, useState, type PropsWithChildren,
} from "react";
import type { SQLiteDatabase } from "expo-sqlite";
import { initializeDatabase } from "./migrationRunner";
import { createDrizzleDatabase, type DrizzleDatabase } from "./drizzle";

type DatabaseContextValue = {
  db: SQLiteDatabase | null;
  drizzleDb: DrizzleDatabase | null;
  ready: boolean;
  error: Error | null;
};

const DatabaseContext = createContext<DatabaseContextValue | undefined>(undefined);

export function DatabaseProvider({ children }: PropsWithChildren) {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [drizzleDb, setDrizzleDb] = useState<DrizzleDatabase | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const setup = async () => {
      try {
        const result = await initializeDatabase();
        const failedMigration = result.migrations.find((migration) => !migration.success);
        if (failedMigration) {
          throw new Error(`Migration ${failedMigration.version} failed: ${failedMigration.error}`);
        }
        const liveDatabase = createDrizzleDatabase(result.db);
        if (mounted) {
          setDb(result.db);
          setDrizzleDb(liveDatabase);
          setReady(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Database initialization failed."));
        }
      }
    };
    void setup();
    return () => { mounted = false; };
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, drizzleDb, ready, error }}>
      {ready ? children : null}
    </DatabaseContext.Provider>
  );
}

function useDatabaseContext(): DatabaseContextValue {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error("Database hooks must be used within DatabaseProvider.");
  return context;
}

export function useDatabase(): SQLiteDatabase {
  const context = useDatabaseContext();
  if (!context.db) throw new Error(context.error?.message ?? "Database is not ready yet.");
  return context.db;
}

export function useDrizzle(): DrizzleDatabase {
  const context = useDatabaseContext();
  if (!context.drizzleDb) throw new Error(context.error?.message ?? "Drizzle database is not ready yet.");
  return context.drizzleDb;
}

export function useDatabaseReady(): boolean {
  return useDatabaseContext().ready;
}

export function useDatabaseError(): Error | null {
  return useDatabaseContext().error;
}
