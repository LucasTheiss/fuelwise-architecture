import { pool,one } from '../../../shared/db/pool.js';
export async function execute({actor,body}) {
  const item=await one(pool,`INSERT INTO fcm_device(account_id,token) VALUES($1,$2)
    ON CONFLICT (token) DO UPDATE SET account_id=excluded.account_id RETURNING id,created_at`,[actor.id,body.token]);
  return {device:item};
}
