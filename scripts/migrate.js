import 'dotenv/config';
import { readdir,readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/shared/db/pool.js';
import { assertConfig } from '../src/shared/config.js';
assertConfig();
const dir=fileURLToPath(new URL('../database/migrations/',import.meta.url));
const db=await pool.connect();
try {
  await db.query('SELECT pg_advisory_lock(7163432)');
  await db.query('CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY,executed_at timestamptz NOT NULL DEFAULT now())');
  const files=(await readdir(dir)).filter(name=>/^\d+.*\.sql$/.test(name)).sort();
  for(const name of files) {
    if ((await db.query('SELECT name FROM schema_migrations WHERE name=$1',[name])).rowCount) continue;
    await db.query('BEGIN');
    try {
      await db.query(await readFile(join(dir,name),'utf8'));
      await db.query('INSERT INTO schema_migrations(name) VALUES($1)',[name]);
      await db.query('COMMIT');
      console.log('Applied:',name);
    } catch(e) { await db.query('ROLLBACK'); throw e; }
  }
  console.log('Migrations complete');
} catch(e){console.error(e);process.exitCode=1;}
finally{ await db.query('SELECT pg_advisory_unlock(7163432)');db.release();await pool.end(); }
