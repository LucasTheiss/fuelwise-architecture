import { pool,one } from '../../../shared/db/pool.js';
export async function execute({actor,body}) {
  const vehicle=await one(pool,`INSERT INTO vehicle(carrier_id,plate,model)
    VALUES($1,$2,$3) RETURNING id,carrier_id,plate,model,created_at`,[actor.carrier_id,body.plate,body.model]);
  return {vehicle:vehicle};
}
