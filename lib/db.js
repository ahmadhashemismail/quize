import fs from "node:fs/promises";
import path from "node:path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DIR, "quiz.db");


let dbInstance = null;

async function getDb() {
  if (dbInstance) return dbInstance;
  
  await fs.mkdir(DIR, { recursive: true });
  
  dbInstance = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });

  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      timeMs INTEGER NOT NULL,
      at INTEGER NOT NULL
    )
  `);

  return dbInstance;
}

export async function readScores() {
  const db = await getDb();
  return db.all("SELECT * FROM scores");
}

export async function addScore(entry) {
  const db = await getDb();
  await db.run(
    "INSERT INTO scores (name, score, total, timeMs, at) VALUES (?, ?, ?, ?, ?)",
    [entry.name, entry.score, entry.total, entry.timeMs, entry.at]
  );
}

export async function topScores(limit = 10) {
  const db = await getDb();
  return db.all(`
    SELECT * FROM scores 
    ORDER BY score DESC, timeMs ASC 
    LIMIT ?
  `, [limit]);
}
