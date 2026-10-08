import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool, tx, one } from '../src/shared/db/pool.js';
import { assertConfig } from '../src/shared/config.js';
import { password as passwordSchema, email as emailSchema } from '../src/shared/http/validate.js';

assertConfig();
const name = process.env.ADMIN_NAME || 'FuelWise Homologation Admin';
const email = emailSchema.parse(process.env.ADMIN_EMAIL || '');
const password = passwordSchema.parse(process.env.ADMIN_PASSWORD || '');
try {
  const existing = await one(pool, 'SELECT id,role FROM account WHERE lower(email)=$1', [email]);
  if (existing) {
    if (existing.role !== 'ADMIN') throw Error('Seed email belongs to a non-admin account');
    console.log('Admin already exists (password unchanged):', existing.id, email);
  } else {
    const hash = await bcrypt.hash(password, 12);
    const id = await tx(async db => {
      const account = await one(db, "INSERT INTO account(name,email,password_hash,role) VALUES($1,$2,$3,'ADMIN') RETURNING id", [name,email,hash]);
      await db.query('INSERT INTO administrator(account_id) VALUES($1)', [account.id]);
      return account.id;
    });
    console.log('Admin created:', id, email);
  }
} catch (e) { console.error('Admin seed error:', e.message); process.exitCode = 1; }
finally { await pool.end(); }
