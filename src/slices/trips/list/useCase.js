import { pool,many } from '../../../shared/db/pool.js';
import { offset } from '../../../shared/http/validate.js';
export async function execute({actor,query}) {
  const items=await many(pool,`SELECT x.id,x.driver_id,x.vehicle_id,x.started_at,x.ended_at,x.status,v.plate,u.name AS driver_name
    FROM trip x JOIN vehicle v ON v.id=x.vehicle_id JOIN account u ON u.id=x.driver_id
    WHERE v.carrier_id=$1 AND ($2::text IS NULL OR x.status=$2)
      AND ($3::uuid IS NULL OR x.driver_id=$3)
    ORDER BY x.started_at DESC LIMIT $4 OFFSET $5`,[actor.carrier_id,query.status??null,actor.role==='DRIVER'?actor.id:null,query.limit,offset(query)]);
  return {items,page:query.page,limit:query.limit};
}
