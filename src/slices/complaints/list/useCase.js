import { pool,many } from '../../../shared/db/pool.js';
import { offset } from '../../../shared/http/validate.js';
export async function execute({actor,query}) {
  const admin=actor.role==='ADMIN';
  const items=await many(pool,`SELECT d.* FROM complaint d
    WHERE ($1::boolean OR d.reporter_account_id=$2) AND ($3::text IS NULL OR d.status=$3)
    ORDER BY d.created_at DESC LIMIT $4 OFFSET $5`,[admin,actor.id,query.status??null,query.limit,offset(query)]);
  return {items,page:query.page,limit:query.limit};
}
