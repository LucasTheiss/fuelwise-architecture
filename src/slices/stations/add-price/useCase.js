import { tx,one } from '../../../shared/db/pool.js';
import { notFound } from '../../../shared/http/errors.js';
import { audit } from '../../../shared/utils/audit.js';
export async function execute({actor,params,body}) {
  return tx(async db=>{
    const station=await one(db,'SELECT id FROM station WHERE id=$1 AND is_active=true',[params.id]);
    if(!station) throw notFound('Posto');
    const price=await one(db,`INSERT INTO fuel_price(station_id,fuel_type,price_per_liter)
      VALUES($1,$2,$3) RETURNING *`,[params.id,body.fuelType,body.pricePerLiter]);
    await audit(db,{actorId:actor.id,resource:'fuel_price',resourceId:price.id,action:'PRICED',details:{stationId:params.id}});
    return {price:price};
  });
}
