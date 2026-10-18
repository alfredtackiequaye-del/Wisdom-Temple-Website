import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dataDirectory = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), ".data"));
fs.mkdirSync(dataDirectory, { recursive: true });

const db = new Database(path.join(dataDirectory, "wisdom-temple.sqlite"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(`
  CREATE TABLE IF NOT EXISTS app_state (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    collection TEXT NOT NULL,
    record_id TEXT NOT NULL
  );
`);

export function readState<T>(key: string, fallback: T): T {
  const row = db.prepare("SELECT value FROM app_state WHERE key = ?").get(key) as { value?: string } | undefined;
  if (!row?.value) return fallback;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return fallback;
  }
}

export function writeState(key: string, value: unknown) {
  db.prepare(`
    INSERT INTO app_state (key, value, updated_at) VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run(key, JSON.stringify(value), new Date().toISOString());
}

export function appendAudit(actor: string, action: string, collection: string, recordId: string) {
  db.prepare("INSERT INTO audit_log (timestamp, actor, action, collection, record_id) VALUES (?, ?, ?, ?, ?)")
    .run(new Date().toISOString(), actor, action, collection, recordId);
}

export function closeDatabase() {
  db.close();
}
