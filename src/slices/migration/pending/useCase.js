import {pool,one} from '../../../shared/db/pool.js';
export async function execute({actor,params}){
  const found=await one(pool,`SELECT f.id FROM fueling f JOIN trip t ON t.id=f.trip_id JOIN vehicle v ON v.id=t.vehicle_id
    WHERE t.id=$1 AND v.carrier_id=$2 AND ($3::uuid IS NULL OR t.driver_id=$3)
    AND f.status IN ('AWAITING_APPROVAL','APPROVED','PAYMENT_UNKNOWN') LIMIT 1`,[params.id,actor.carrier_id,actor.role==='DRIVER'?actor.id:null]);
  return {pending:Boolean(found)};
}
