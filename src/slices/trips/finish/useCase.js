import { tx,one } from '../../../shared/db/pool.js';
import { conflict,notFound } from '../../../shared/http/errors.js';
import { audit } from '../../../shared/utils/audit.js';
export async function execute({actor,params}) {
  return tx(async db=>{
    const trip=await one(db,`SELECT x.*,v.carrier_id FROM trip x JOIN vehicle v ON v.id=x.vehicle_id
      WHERE x.id=$1 AND v.carrier_id=$2 FOR UPDATE OF x`,[params.id,actor.carrier_id]);
    if (!trip || (actor.role==='DRIVER' && trip.driver_id!==actor.id)) throw notFound('Viagem');
    if (trip.status!=='IN_PROGRESS') throw conflict('Viagem já finalizada');
    const pending=await one(db,`SELECT id FROM fueling WHERE trip_id=$1 AND status IN ('AWAITING_APPROVAL','APPROVED','PAYMENT_UNKNOWN') LIMIT 1`,[trip.id]);
    if (pending) throw conflict('Existem fuelings pendentes de decisão ou payment');
    const updated=await one(db,"UPDATE trip SET status='FINISHED',ended_at=now() WHERE id=$1 RETURNING *",[trip.id]);
    await audit(db,{actorId:actor.id,tenantId:actor.carrier_id,resource:'trip',resourceId:trip.id,action:'FINISHED'});
    return {trip:updated};
  });
}
