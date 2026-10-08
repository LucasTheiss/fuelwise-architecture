import { pool,many } from '../../../shared/db/pool.js';
import { offset } from '../../../shared/http/validate.js';
export async function execute({actor,query}) {
  const tenant=actor.role==='ADMIN'?(query.carrierId??null):actor.carrier_id;
  const items=await many(pool,`SELECT p.id,p.fueling_id,p.amount,p.status,p.gateway_transaction_code,
    p.created_at,p.processed_at,c.carrier_id,v.driver_id,a.station_id,a.liters,a.unit_price
    FROM payment p JOIN fueling a ON a.id=p.fueling_id
    JOIN trip v ON v.id=a.trip_id JOIN vehicle c ON c.id=v.vehicle_id
    WHERE ($1::uuid IS NULL OR c.carrier_id=$1)
    ORDER BY p.created_at DESC LIMIT $2 OFFSET $3`,[tenant,query.limit,offset(query)]);
  return {items,page:query.page,limit:query.limit};
}
