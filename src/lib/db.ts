import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";

const DB_PATH = process.env.DB_PATH ?? resolve(process.cwd(), "data", "db.sqlite");

let cached: Database.Database | null = null;

const getDb = (): Database.Database => {
  if (cached) return cached;
  mkdirSync(dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS counter (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      value INTEGER NOT NULL DEFAULT 0
    );
    INSERT OR IGNORE INTO counter (id, value) VALUES (1, 0);
  `);
  cached = db;
  return db;
};

export const getCounter = (): number => {
  const row = getDb().prepare("SELECT value FROM counter WHERE id = 1").get() as
    | { value: number }
    | undefined;
  return row?.value ?? 0;
};

export const incrementCounter = (): number => {
  const row = getDb()
    .prepare("UPDATE counter SET value = value + 1 WHERE id = 1 RETURNING value")
    .get() as { value: number };
  return row.value;
};
