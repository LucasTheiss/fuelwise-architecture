import { pool } from '../../../shared/db/pool.js';
import { hashToken } from '../../../shared/auth/tokens.js';
export async function execute({body}) {
  await pool.query('UPDATE refresh_session SET revoked_at=now() WHERE token_hash=$1 AND revoked_at IS NULL',[hashToken(body.refreshToken)]);
  return {message:'Sessão encerrada'};
}
