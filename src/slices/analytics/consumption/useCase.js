import { pool,many } from '../../../shared/db/pool.js';
import { badRequest } from '../../../shared/http/errors.js';
export async function execute({actor,query}) {
  if ((Date.parse(query.endDate)-Date.parse(query.startDate))/86400000 > 366) throw badRequest('Período máximo: 366 dias');
  const tenant=actor.role==='ADMIN'?(query.carrierId??null):actor.carrier_id;
  const items=await many(pool,`SELECT date_trunc('month',a.created_at)::date AS month,
    c.carrier_id,a.fuel_type,COUNT(*)::int AS count,
    COALESCE(SUM(a.liters),0)::text AS liters,
    COALESCE(SUM(a.total_amount),0)::text AS total_amount,
    COALESCE(SUM(a.total_amount) FILTER (WHERE a.status='PAID'),0)::text AS paid_amount
    FROM fueling a JOIN trip v ON v.id=a.trip_id JOIN vehicle c ON c.id=v.vehicle_id
    WHERE a.created_at >= $1::date AND a.created_at < ($2::date + interval '1 day')
      AND ($3::uuid IS NULL OR c.carrier_id=$3)
    GROUP BY 1,2,3 ORDER BY 1,2,3`,[query.startDate,query.endDate,tenant]);
  return {items,period:{startDate:query.startDate,endDate:query.endDate}};
}
