import bcrypt from 'bcryptjs';
import { pool,one,tx } from '../../../shared/db/pool.js';
import { unauthenticated,forbidden } from '../../../shared/http/errors.js';
import { issueSession,signAccess } from '../../../shared/auth/tokens.js';
export async function execute({body}) {
  const user=await one(pool,`SELECT u.id,u.name,u.email,u.role,u.password_hash,u.is_active,
    COALESCE(g.carrier_id,c.carrier_id) AS carrier_id,t.status AS tenant_status
    FROM account u LEFT JOIN manager g ON u.id=g.account_id
    LEFT JOIN driver c ON u.id=c.account_id
    LEFT JOIN carrier t ON t.id=COALESCE(g.carrier_id,c.carrier_id)
    WHERE lower(u.email)=$1`,[body.email]);
  // Always perform a hash comparison to reduce email enumeration timing leakage.
  const comparisonHash='$2a$12$WzrWvHJ.KlkGjxV8dUV2E.VZp3pRfV7WqZQqKRwvVpjbd5xs.hD6m';
  if (!await bcrypt.compare(body.password,user?.password_hash || comparisonHash) || !user?.is_active) throw unauthenticated();
  if (user.role !== 'ADMIN' && user.tenant_status !== 'ACTIVE') throw forbidden();
  const refreshToken=await tx(db=>issueSession(db,user.id));
  return {accessToken:signAccess(user),refreshToken,tokenType:'Bearer',expiresIn:900,
    account:{id:user.id,name:user.name,email:user.email,role:user.role,carrierId:user.carrier_id}};
}
