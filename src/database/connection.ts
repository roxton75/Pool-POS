import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";

let database: SQLiteDatabase | null = null;
let databasePromise: Promise<SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLiteDatabase> {
  if (database) return Promise.resolve(database);
  if (!databasePromise) {
    databasePromise = (async () => {
      const db = await openDatabaseAsync("qzone.db", { enableChangeListener: true });
      await db.execAsync("PRAGMA foreign_keys = ON;");
      database = db;
      return db;
    })().catch((error) => {
      databasePromise = null;
      throw error;
    });
  }
  return databasePromise;
}

export async function closeDatabase(): Promise<void> {
  if (databasePromise) {
    try { await databasePromise; } catch { /* No connection to close. */ }
  }
  if (database) {
    await database.closeAsync();
    database = null;
  }
  databasePromise = null;
}
