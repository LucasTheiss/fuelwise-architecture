import { pool,one } from '../../../shared/db/pool.js';
import { forbidden,notFound,unavailable } from '../../../shared/http/errors.js';
export async function execute({actor,params},deps) {
  const vehicle=await one(pool,'SELECT id,carrier_id FROM vehicle WHERE id=$1',[params.id]);
  if (!vehicle) throw notFound('Veículo');
  if (actor.role!=='ADMIN') {
    if (vehicle.carrier_id!==actor.carrier_id) throw notFound('Veículo');
    if (actor.role==='DRIVER') {
      const trip=await one(pool,"SELECT id FROM trip WHERE vehicle_id=$1 AND driver_id=$2 AND status='IN_PROGRESS'",[params.id,actor.id]);
      if (!trip) throw forbidden();
    }
  }
  try {
    const result=await deps.gps.locate(vehicle.id);
    await pool.query(`INSERT INTO vehicle_location (vehicle_id,latitude,longitude,recorded_at) VALUES($1,$2,$3,$4)
      ON CONFLICT (vehicle_id) DO UPDATE SET latitude=excluded.latitude,longitude=excluded.longitude,
      recorded_at=excluded.recorded_at WHERE vehicle_location.recorded_at<=excluded.recorded_at`,
    [vehicle.id,result.latitude,result.longitude,result.recordedAt]);
    return {vehicleId:vehicle.id,...result,origin:deps.gps.simulated ? 'MOCK' : 'GPS',degraded:false,simulated:Boolean(deps.gps.simulated)};
  } catch (err) {
    console.error(JSON.stringify({event:'gps_failed',vehicleId:vehicle.id,error:err.message}));
    const last=await one(pool,'SELECT latitude,longitude,recorded_at FROM vehicle_location WHERE vehicle_id=$1',[params.id]);
    if (!last) throw unavailable('Serviço GPS indisponível e sem última localização');
    return {vehicleId:vehicle.id,latitude:Number(last.latitude),longitude:Number(last.longitude),recordedAt:last.recorded_at,origin:'CACHE',degraded:true,simulated:false};
  }
}
