import {pool,one} from '../../../shared/db/pool.js';
export async function execute({actor,query}){
  const found=await one(pool,`SELECT d.account_id FROM driver d JOIN account a ON a.id=d.account_id
    JOIN vehicle v ON v.carrier_id=d.carrier_id WHERE d.account_id=$1 AND v.id=$2 AND d.carrier_id=$3 AND a.is_active=true`,[query.driverId,query.vehicleId,actor.carrier_id]);
  return {valid:Boolean(found)};
}
