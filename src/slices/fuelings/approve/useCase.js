import { tx,one } from '../../../shared/db/pool.js';
import { conflict,notFound } from '../../../shared/http/errors.js';
import { audit,enqueue } from '../../../shared/utils/audit.js';
export async function execute({actor,params,body}) {
  return tx(async db=>{
    const a=await one(db,`SELECT a.id,a.status,v.driver_id FROM fueling a
      JOIN trip v ON v.id=a.trip_id JOIN vehicle c ON c.id=v.vehicle_id
      WHERE a.id=$1 AND c.carrier_id=$2 FOR UPDATE OF a`,[params.id,actor.carrier_id]);
    if (!a) throw notFound('Abastecimento');
    if (a.status!=='AWAITING_APPROVAL') throw conflict('Abastecimento já analisado');
    const status=body.decision==='APPROVE'?'APPROVED':'REJECTED';
    const result=await one(db,'UPDATE fueling SET status=$2,approved_by=$3,decided_at=now() WHERE id=$1 RETURNING *',[params.id,status,actor.id]);
    await enqueue(db,a.driver_id,'FUELING_DECISION',{message:`Seu fueling foi ${status.toLowerCase()}`,fuelingId:a.id,status});
    await audit(db,{actorId:actor.id,tenantId:actor.carrier_id,resource:'fueling',resourceId:a.id,action:status});
    return {fueling:result};
  });
}
