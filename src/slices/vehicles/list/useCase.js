import { pool,many } from '../../../shared/db/pool.js';
import { offset } from '../../../shared/http/validate.js';
export async function execute({actor,query}) {
  const items=await many(pool,`SELECT v.id,v.plate,v.model,v.created_at,
    EXISTS(SELECT 1 FROM trip x WHERE x.vehicle_id=v.id AND x.status='IN_PROGRESS') AS on_trip
    FROM vehicle v WHERE v.carrier_id=$1 ORDER BY v.created_at DESC LIMIT $2 OFFSET $3`,[actor.carrier_id,query.limit,offset(query)]);
  return {items,page:query.page,limit:query.limit};
}
