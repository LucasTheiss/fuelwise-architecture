import { pool,one } from '../../../shared/db/pool.js';
import { notFound } from '../../../shared/http/errors.js';
export async function execute({actor,params}) {
  const p=await one(pool,`SELECT pg.*,c.carrier_id,v.driver_id, a.status AS fueling_status
    FROM payment pg JOIN fueling a ON a.id=pg.fueling_id
    JOIN trip v ON v.id=a.trip_id JOIN vehicle c ON c.id=v.vehicle_id WHERE pg.id=$1`,[params.id]);
  if (!p || (actor.role!=='ADMIN' && p.carrier_id!==actor.carrier_id) ||
    (actor.role==='DRIVER' && p.driver_id!==actor.id)) throw notFound('Pagamento');
  return {payment:p};
}
