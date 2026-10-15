import { tx,one } from '../../../shared/db/pool.js';
import { notFound } from '../../../shared/http/errors.js';
import { audit,enqueue } from '../../../shared/utils/audit.js';
/** Implementação PostgreSQL da porta fuelingStore.decide. A regra de decisão vem do domínio, pelo caso de uso. */
export async function decideFueling(actor, fuelingId, rule) {
  return tx(async db=>{
    const a=await one(db,`SELECT a.id,a.status,v.driver_id FROM fueling a
      JOIN trip v ON v.id=a.trip_id JOIN vehicle c ON c.id=v.vehicle_id
      WHERE a.id=$1 AND c.carrier_id=$2 FOR UPDATE OF a`,[fuelingId,actor.carrier_id]);
    if (!a) throw notFound('Abastecimento');
    const status=rule(a);
    const result=await one(db,'UPDATE fueling SET status=$2,approved_by=$3,decided_at=now() WHERE id=$1 RETURNING *',[fuelingId,status,actor.id]);
    await enqueue(db,a.driver_id,'FUELING_DECISION',{message:`Seu fueling foi ${status.toLowerCase()}`,fuelingId:a.id,status});
    await audit(db,{actorId:actor.id,tenantId:actor.carrier_id,resource:'fueling',resourceId:a.id,action:status});
    return result;
  });
}
