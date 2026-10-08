import { tx,one,many } from '../../../shared/db/pool.js';
import { badRequest,notFound } from '../../../shared/http/errors.js';
import { calculateFuelingTotal } from '../../../shared/utils/money.js';
import { audit,enqueue } from '../../../shared/utils/audit.js';
export async function execute({actor,body}) {
  return tx(async db=>{
    const trip=await one(db,`SELECT v.id FROM trip v JOIN vehicle c ON c.id=v.vehicle_id
      WHERE v.id=$1 AND v.driver_id=$2 AND v.status='IN_PROGRESS'
      AND c.carrier_id=$3 FOR UPDATE OF v`,[body.tripId,actor.id,actor.carrier_id]);
    if (!trip) throw badRequest('Viagem não está ativa ou não pertence ao motorista');
    const station=await one(db,'SELECT id FROM station WHERE id=$1 AND is_active=true',[body.stationId]);
    if (!station) throw notFound('Posto');
    const price=await one(db,`SELECT price_per_liter FROM fuel_price
      WHERE station_id=$1 AND fuel_type=$2 AND effective_from<=now()
      ORDER BY effective_from DESC LIMIT 1`,[body.stationId,body.fuelType]);
    if (!price) throw badRequest('Posto sem preço válido para este combustível');
    const value=calculateFuelingTotal(body.liters,price.price_per_liter);
    const fuel=await one(db,`INSERT INTO fueling(trip_id,station_id,fuel_type,liters,unit_price,total_amount)
      VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,[body.tripId,body.stationId,body.fuelType,body.liters,price.price_per_liter,value]);
    const managers=await many(db,'SELECT account_id FROM manager WHERE carrier_id=$1',[actor.carrier_id]);
    for(const manager of managers) await enqueue(db,manager.account_id,'FUELING_PENDING',{message:'Aprovação de fueling pendente',fuelingId:fuel.id});
    await audit(db,{actorId:actor.id,tenantId:actor.carrier_id,resource:'fueling',resourceId:fuel.id,action:'REQUESTED',details:{amount:value}});
    return {fueling:fuel};
  });
}
