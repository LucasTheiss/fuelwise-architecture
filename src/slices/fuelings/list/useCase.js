import { pool,many } from '../../../shared/db/pool.js';
import { offset } from '../../../shared/http/validate.js';
export async function execute({actor,query}) {
  const items=await many(pool,`SELECT a.*,p.name AS station_name,v.driver_id,pg.id AS payment_id,pg.status AS payment_status
    FROM fueling a JOIN trip v ON v.id=a.trip_id JOIN vehicle c ON c.id=v.vehicle_id
    JOIN station p ON p.id=a.station_id LEFT JOIN payment pg ON pg.fueling_id=a.id
    WHERE c.carrier_id=$1 AND ($2::uuid IS NULL OR v.driver_id=$2)
      AND ($3::text IS NULL OR a.status=$3) ORDER BY a.created_at DESC LIMIT $4 OFFSET $5`,
    [actor.carrier_id,actor.role==='DRIVER'?actor.id:null,query.status??null,query.limit,offset(query)]);
  return {items,page:query.page,limit:query.limit};
}
