import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

let _db: SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (!_db) {
    _db = await openDatabaseAsync("qzone.db");
  }
  return _db;
};

export const closeDatabase = async (): Promise<void> => {
  if (_db) {
    await _db.closeAsync();
    _db = null;
  }
};