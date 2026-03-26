import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { app } from "electron";
import { join } from "node:path";
import * as schema from "./schema";

type DatabaseInstance = ReturnType<typeof drizzle<typeof schema>>;

let db: DatabaseInstance | null = null;
let sqlite: Database.Database | null = null;

export function getDb(): DatabaseInstance {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
}

export function initDatabase(): void {
  const dbPath = join(app.getPath("userData"), "sasori.db");
  sqlite = new Database(dbPath);

  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  db = drizzle(sqlite, { schema });

  const migrationsFolder = app.isPackaged
    ? join(process.resourcesPath, "migrations")
    : join(__dirname, "../../src/database/migrations");
  migrate(db, { migrationsFolder });
}

export function closeDatabase(): void {
  if (sqlite) {
    sqlite.close();
    sqlite = null;
    db = null;
  }
}
