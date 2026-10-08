import { pool,many } from '../../../shared/db/pool.js';
import { offset } from '../../../shared/http/validate.js';
export async function execute({query}) {
  // ACOS is clamped to protect against floating-point rounding near cos=1.
  const items=await many(pool,`WITH geo AS (
      SELECT p.*, CASE WHEN $1::numeric IS NULL THEN NULL ELSE
        6371 * acos(LEAST(1,GREATEST(-1,
          sin(radians($1::float8))*sin(radians(p.latitude::float8)) +
          cos(radians($1::float8))*cos(radians(p.latitude::float8))*cos(radians(p.longitude::float8-$2::float8))
        ))) END AS distance_km
      FROM station p WHERE p.is_active=true AND ($3::boolean IS NULL OR p.is_affiliated=$3)
    ) SELECT * FROM geo WHERE ($1::numeric IS NULL OR distance_km<=$4)
      ORDER BY distance_km ASC NULLS LAST, name ASC LIMIT $5 OFFSET $6`,
    [query.latitude??null,query.longitude??null,query.isAffiliated===undefined?null:query.isAffiliated==='true',query.radiusKm,query.limit,offset(query)]);
  return {items,page:query.page,limit:query.limit,radiusKm:query.latitude===undefined?null:query.radiusKm};
}
