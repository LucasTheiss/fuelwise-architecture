import { tx,one } from '../../../shared/db/pool.js';
import { badRequest } from '../../../shared/http/errors.js';
import { audit,enqueue } from '../../../shared/utils/audit.js';
export async function execute({actor,body}) {
  return tx(async db => {
    const [driver,vehicle]=await Promise.all([
      one(db,'SELECT account_id FROM driver WHERE account_id=$1 AND carrier_id=$2',[body.driverId,actor.carrier_id]),
      one(db,'SELECT id FROM vehicle WHERE id=$1 AND carrier_id=$2',[body.vehicleId,actor.carrier_id])
    ]);
    if (!driver || !vehicle) throw badRequest('Motorista e veículo precisam pertencer à sua carrier');
    const trip=await one(db,`INSERT INTO trip(driver_id,vehicle_id) VALUES($1,$2)
      RETURNING id,driver_id,vehicle_id,started_at,status`,[driver.account_id,vehicle.id]);
    await enqueue(db,driver.account_id,'TRIP_STARTED',{message:'Uma trip foi atribuída a você',tripId:trip.id});
    await audit(db,{actorId:actor.id,tenantId:actor.carrier_id,resource:'trip',resourceId:trip.id,action:'STARTED'});
    return {trip:trip};
  });
}
