import pg from 'pg';
import { config } from '../config.js';
export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: config.dbSSL ? { rejectUnauthorized: true } : false,
  max: 15,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 5000
});
export async function tx(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
export async function one(db, sql, params = []) {
  const { rows } = await db.query(sql, params);
  return rows[0] ?? null;
}
export async function many(db, sql, params = []) {
  return (await db.query(sql, params)).rows;
}
