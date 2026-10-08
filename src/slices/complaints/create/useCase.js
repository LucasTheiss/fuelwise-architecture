import { tx,one } from '../../../shared/db/pool.js';
import { badRequest,notFound } from '../../../shared/http/errors.js';
import { audit } from '../../../shared/utils/audit.js';
export async function execute({actor,body}) {
  return tx(async db=>{
    if (body.stationId) {
      const station=await one(db,'SELECT id FROM station WHERE id=$1',[body.stationId]);
      if(!station) throw notFound('Posto');
    }
    if(body.paymentId) {
      const p=await one(db,`SELECT pg.id,c.carrier_id,v.driver_id FROM payment pg
        JOIN fueling a ON a.id=pg.fueling_id
        JOIN trip v ON v.id=a.trip_id JOIN vehicle c ON c.id=v.vehicle_id WHERE pg.id=$1`,[body.paymentId]);
      if(!p || (actor.role!=='ADMIN' && actor.carrier_id!==p.carrier_id) ||
        (actor.role==='DRIVER' && actor.id!==p.driver_id)) throw notFound('Pagamento');
    }
    const complaint=await one(db,`INSERT INTO complaint(reporter_account_id,station_id,payment_id,description)
      VALUES($1,$2,$3,$4) RETURNING *`,[actor.id,body.stationId??null,body.paymentId??null,body.description]);
    await audit(db,{actorId:actor.id,tenantId:actor.carrier_id,resource:'complaint',resourceId:complaint.id,action:'OPEN'});
    return {complaint:complaint};
  });
}
