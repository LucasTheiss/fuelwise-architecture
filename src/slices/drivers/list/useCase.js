import { pool,many } from '../../../shared/db/pool.js';
import { offset } from '../../../shared/http/validate.js';
export async function execute({actor,query}) {
  const items=await many(pool,`SELECT u.id,u.name,u.email,u.is_active,u.created_at,c.driver_license
    FROM driver c JOIN account u ON u.id=c.account_id
    WHERE c.carrier_id=$1 ORDER BY u.created_at DESC LIMIT $2 OFFSET $3`,[actor.carrier_id,query.limit,offset(query)]);
  return {items,page:query.page,limit:query.limit};
}
