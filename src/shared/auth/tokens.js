import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'node:crypto';
import { config } from '../config.js';
export const hashToken = (v) => createHash('sha256').update(v).digest('hex');
export function signAccess(user) {
  return jwt.sign({ role: user.role }, config.jwtSecret, {
    algorithm: 'HS256', subject: user.id, expiresIn: config.jwtExpiresIn,
    issuer: 'fuelwise', audience: 'fuelwise-web'
  });
}
export function verifyAccess(raw) {
  return jwt.verify(raw, config.jwtSecret, { algorithms: ['HS256'], issuer: 'fuelwise', audience: 'fuelwise-web' });
}
export function generateRefresh() { return randomBytes(48).toString('base64url'); }
export async function issueSession(db, userId) {
  const refreshToken = generateRefresh();
  await db.query("INSERT INTO refresh_session (account_id,token_hash,expires_at) VALUES ($1,$2, now()+($3 * interval '1 day'))", [userId,hashToken(refreshToken),config.refreshDays]);
  return refreshToken;
}
