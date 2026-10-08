import { pool,many } from '../../../shared/db/pool.js';
import { offset } from '../../../shared/http/validate.js';
export async function execute({params,query}) {
  const items=await many(pool,`SELECT id,station_id,fuel_type,price_per_liter,effective_from FROM fuel_price
    WHERE station_id=$1 AND ($2::text IS NULL OR fuel_type=$2)
    ORDER BY effective_from DESC LIMIT $3 OFFSET $4`,[params.id,query.type??null,query.limit,offset(query)]);
  return {items,page:query.page,limit:query.limit};
}
