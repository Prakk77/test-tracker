import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  // Use Railway volume if provided, else fallback to local /data
  const dbDir = process.env.DB_PATH || path.join(process.cwd(), 'data');

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, 'testtracker.db');
  db = new Database(dbPath);

  // Optional but recommended
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS test_cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      environment TEXT NOT NULL CHECK(environment IN ('dev', 'staging', 'production')),
      status TEXT NOT NULL DEFAULT 'not_tested' CHECK(status IN ('passed', 'failed', 'not_tested')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_environment ON test_cases(environment);
    CREATE INDEX IF NOT EXISTS idx_status ON test_cases(status);
  `);

  return db;
}

export type TestCase = {
  id: number;
  name: string;
  environment: 'dev' | 'staging' | 'production';
  status: 'passed' | 'failed' | 'not_tested';
  created_at: string;
  updated_at: string;
};

export type Environment = 'dev' | 'staging' | 'production';
export type Status = 'passed' | 'failed' | 'not_tested';