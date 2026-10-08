import { pool, one } from '../db/pool.js';
import { verifyAccess } from './tokens.js';
import { asyncRoute, forbidden, unauthenticated } from '../http/errors.js';
export const auth = asyncRoute(async (req, _res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer?.startsWith('Bearer ')) throw unauthenticated();
  let payload;
  try { payload = verifyAccess(bearer.slice(7)); } catch { throw unauthenticated(); }
  const user = await one(pool, `
    SELECT u.id,u.name,u.email,u.role,u.is_active,
      COALESCE(g.carrier_id,c.carrier_id) AS carrier_id, t.status AS carrier_status
    FROM account u
    LEFT JOIN manager g ON g.account_id=u.id
    LEFT JOIN driver c ON c.account_id=u.id
    LEFT JOIN carrier t ON t.id=COALESCE(g.carrier_id,c.carrier_id)
    WHERE u.id=$1`, [payload.sub]);
  if (!user?.is_active || user.role !== payload.role || (user.role !== 'ADMIN' && user.carrier_status !== 'ACTIVE')) throw unauthenticated();
  req.actor = user;
  next();
});
export const role = (...allowed) => (req, _res, next) => allowed.includes(req.actor?.role) ? next() : next(forbidden());
export const scopeId = (actor) => actor.role === 'ADMIN' ? null : actor.carrier_id;
