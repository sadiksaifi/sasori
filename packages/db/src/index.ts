import { resolve } from "node:path";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import * as schema from "./schema";

const DB_PATH = resolve(import.meta.dir, "../sqlite.db");
const sqlite = new Database(DB_PATH);
sqlite.exec("PRAGMA journal_mode = WAL;");
sqlite.exec("PRAGMA foreign_keys = ON;");
sqlite.exec("PRAGMA busy_timeout = 5000;");
sqlite.exec("PRAGMA synchronous = NORMAL;");
sqlite.exec("PRAGMA cache_size = -20000;");
sqlite.exec("PRAGMA temp_store = MEMORY;");
export const db = drizzle({ client: sqlite, schema });
