import { pool,one,many } from '../../../shared/db/pool.js';
import { notFound } from '../../../shared/http/errors.js';
export async function execute({params}) {
  const station=await one(pool,'SELECT * FROM station WHERE id=$1 AND is_active=true',[params.id]);
  if (!station) throw notFound('Posto');
  const prices=await many(pool,`SELECT DISTINCT ON (fuel_type) fuel_type,price_per_liter,effective_from
    FROM fuel_price WHERE station_id=$1 AND effective_from<=now()
    ORDER BY fuel_type,effective_from DESC`,[params.id]);
  return {station,currentPrices:prices};
}
