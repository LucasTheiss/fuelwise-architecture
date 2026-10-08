import { pool,many } from '../../../shared/db/pool.js';
import { offset } from '../../../shared/http/validate.js';
export async function execute({query}) {
  const rows=await many(pool,`SELECT t.id,t.name,t.legal_name,t.tax_id,t.status,t.created_at,
    u.id AS manager_id,u.name AS manager_name,u.email AS manager_email
    FROM carrier t JOIN manager g ON g.carrier_id=t.id JOIN account u ON u.id=g.account_id
    WHERE t.status=$1 ORDER BY t.created_at DESC LIMIT $2 OFFSET $3`,[query.status,query.limit,offset(query)]);
  return {items:rows,page:query.page,limit:query.limit};
}
