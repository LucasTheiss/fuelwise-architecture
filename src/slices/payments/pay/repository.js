import { pool,tx,one } from '../../../shared/db/pool.js';
import { notFound } from '../../../shared/http/errors.js';
import { audit,enqueue } from '../../../shared/utils/audit.js';
import { assertPayable,statusAfterPayment } from '../../../domain/fueling.js';
import { idempotencyKey,canBeFinalized } from '../../../domain/payment.js';
/** Persistence port's PostgreSQL implementation. Reserve before any network call. */
export async function reservePayment(actor, fuelId) {
  return tx(async db=>{
    const a=await one(db,`SELECT a.*,v.driver_id,v.status AS trip_status,c.carrier_id
      FROM fueling a JOIN trip v ON v.id=a.trip_id JOIN vehicle c ON c.id=v.vehicle_id
      WHERE a.id=$1 AND v.driver_id=$2 AND c.carrier_id=$3
      FOR UPDATE OF a`,[fuelId,actor.id,actor.carrier_id]);
    if (!a) throw notFound('Abastecimento');
    const existing=await one(db,'SELECT * FROM payment WHERE fueling_id=$1',[fuelId]);
    if (existing) return {payment:existing,newlyCreated:false};
    assertPayable(a,a.trip_status);
    const payment=await one(db,`INSERT INTO payment(fueling_id,amount,status,idempotency_key)
      VALUES($1,$2,'PROCESSING',$3) RETURNING *`,[fuelId,a.total_amount,idempotencyKey(fuelId)]);
    await audit(db,{actorId:actor.id,tenantId:actor.carrier_id,resource:'payment',resourceId:payment.id,action:'PROCESSING',details:{fuelingId:fuelId,amount:payment.amount}});
    return {payment,newlyCreated:true};
  });
}
export async function finalizePayment(paymentId, result, actor) {
  return tx(async db=>{
    const payment=await one(db,'SELECT * FROM payment WHERE id=$1 FOR UPDATE',[paymentId]);
    if (!payment) throw notFound('Pagamento');
    if (!canBeFinalized(payment)) return payment;
    const updated=await one(db,`UPDATE payment SET status=$2,gateway_transaction_code=$3,
      gateway_message=$4,processed_at=now() WHERE id=$1 RETURNING *`,
    [paymentId,result.status,result.transactionId??null,result.message??null]);
    const status=statusAfterPayment(result.status);
    await db.query('UPDATE fueling SET status=$2 WHERE id=$1',[payment.fueling_id,status]);
    const driver=await one(db,`SELECT v.driver_id,c.carrier_id FROM fueling a
      JOIN trip v ON v.id=a.trip_id JOIN vehicle c ON c.id=v.vehicle_id WHERE a.id=$1`,[payment.fueling_id]);
    await enqueue(db,driver.driver_id,'PAYMENT',{message:`Pagamento: ${result.status.toLowerCase()}`,paymentId:updated.id,status:result.status});
    await audit(db,{actorId:actor?.id??null,tenantId:driver.carrier_id,resource:'payment',resourceId:paymentId,action:result.status,details:{gatewayTransaction:result.transactionId??null}});
    return updated;
  });
}
export async function findPayment(paymentId) {
  return one(pool,'SELECT * FROM payment WHERE id=$1',[paymentId]);
}
