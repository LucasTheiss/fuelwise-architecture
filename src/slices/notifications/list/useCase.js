import { pool,many } from '../../../shared/db/pool.js';
import { offset } from '../../../shared/http/validate.js';
export async function execute({actor,query}) {
  const items=await many(pool,`SELECT id,type,payload,status,created_at,sent_at FROM notification WHERE account_id=$1
    ORDER BY created_at DESC LIMIT $2 OFFSET $3`,[actor.id,query.limit,offset(query)]);
  return {items,page:query.page,limit:query.limit};
}
