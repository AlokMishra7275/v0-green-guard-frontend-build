import Database from 'better-sqlite3';
import { join } from 'path';

// Database file location
const dbPath = process.env.DATABASE_PATH || join(process.cwd(), 'data', 'app.db');

// Create database instance
let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const { mkdirSync, existsSync } = require('fs');
    const { dirname } = require('path');
    const dir = dirname(dbPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    
    // Initialize schema
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

// Generate a unique ID (similar to cuid)
function generateId(): string {
  return 'c' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  password: string;
  created_at: string;
  updated_at: string;
}

export const userDb = {
  findByEmail(email: string): User | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
  },

  findById(id: string): User | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  },

  create(data: { email: string; password: string; name?: string }): User {
    const db = getDb();
    const id = generateId();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO users (id, email, password, name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, data.email, data.password, data.name || null, now, now);
    
    return this.findById(id)!;
  },
};

export { getDb };
