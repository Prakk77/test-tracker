const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'testtracker.db');
const db = new Database(dbPath);

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

// Seed data
const existing = db.prepare('SELECT COUNT(*) as count FROM test_cases').get();
if (existing.count === 0) {
  const insert = db.prepare(`
    INSERT INTO test_cases (name, environment, status) VALUES (?, ?, ?)
  `);

  const seeds = [
    ['User login flow', 'dev', 'passed'],
    ['API authentication', 'dev', 'passed'],
    ['Database migrations', 'dev', 'failed'],
    ['Payment gateway', 'dev', 'not_tested'],
    ['Email notifications', 'dev', 'passed'],
    ['User login flow', 'staging', 'passed'],
    ['API authentication', 'staging', 'passed'],
    ['Database migrations', 'staging', 'passed'],
    ['Payment gateway', 'staging', 'failed'],
    ['Email notifications', 'staging', 'not_tested'],
    ['Load balancer config', 'staging', 'passed'],
    ['User login flow', 'production', 'passed'],
    ['API authentication', 'production', 'passed'],
    ['Database migrations', 'production', 'passed'],
    ['Payment gateway', 'production', 'passed'],
    ['Email notifications', 'production', 'passed'],
    ['CDN cache invalidation', 'production', 'failed'],
  ];

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(...row);
  });
  insertMany(seeds);
  console.log(`✓ Seeded ${seeds.length} test cases`);
}

console.log(`✓ Database initialized at ${dbPath}`);
db.close();
