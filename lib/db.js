import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

let initialized = false;

async function initDb() {
  if (initialized) return;
  
  await sql`
    CREATE TABLE IF NOT EXISTS scores (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      timeMs BIGINT NOT NULL,
      at BIGINT NOT NULL
    )
  `;
  initialized = true;
}

export async function readScores() {
  await initDb();
  return sql`SELECT * FROM scores`;
}

export async function addScore(entry) {
  await initDb();
  await sql`
    INSERT INTO scores (name, score, total, timeMs, at) 
    VALUES (${entry.name}, ${entry.score}, ${entry.total}, ${entry.timeMs}, ${entry.at})
  `;
}

export async function topScores(limit = 10) {
  await initDb();
  // Postgres returns numeric types that don't fit in JS number as strings by default in some drivers, 
  // but let's just make sure we handle it if needed. For now let's just use standard query.
  return sql`
    SELECT * FROM scores 
    ORDER BY score DESC, timeMs ASC 
    LIMIT ${limit}
  `;
}
