import { tx,one } from '../../../shared/db/pool.js';
import { hashToken,issueSession,signAccess } from '../../../shared/auth/tokens.js';
import { unauthenticated } from '../../../shared/http/errors.js';
export async function execute({body}) {
  return tx(async db=>{
    const session=await one(db,`SELECT s.*,u.id AS account_user_id,u.role,u.is_active,
      t.status AS tenant_status FROM refresh_session s
      JOIN account u ON u.id=s.account_id
      LEFT JOIN manager g ON g.account_id=u.id
      LEFT JOIN driver c ON c.account_id=u.id
      LEFT JOIN carrier t ON t.id=COALESCE(g.carrier_id,c.carrier_id)
      WHERE s.token_hash=$1 FOR UPDATE OF s`,[hashToken(body.refreshToken)]);
    if (!session || session.revoked_at || new Date(session.expires_at)<=new Date() || !session.is_active ||
      (session.role!=='ADMIN' && session.tenant_status!=='ACTIVE')) throw unauthenticated();
    await db.query('UPDATE refresh_session SET revoked_at=now() WHERE id=$1',[session.id]);
    const refreshToken=await issueSession(db,session.account_id);
    return {accessToken:signAccess({id:session.account_id,role:session.role}),refreshToken,tokenType:'Bearer',expiresIn:900};
  });
}
