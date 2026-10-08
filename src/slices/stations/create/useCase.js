import { pool,one } from '../../../shared/db/pool.js';
export async function execute({body}) {
  const station=await one(pool,`INSERT INTO station(name,address,latitude,longitude,is_affiliated)
    VALUES($1,$2,$3,$4,$5) RETURNING *`,[body.name,body.address,body.latitude,body.longitude,body.isAffiliated]);
  return {station};
}
