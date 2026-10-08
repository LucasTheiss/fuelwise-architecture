import { pool,one } from '../../../shared/db/pool.js';
import { notFound,conflict } from '../../../shared/http/errors.js';
export async function execute({actor,params},deps) {
  const p=await one(pool,'SELECT * FROM payment WHERE id=$1',[params.id]);
  if (!p) throw notFound('Pagamento');
  if (!['PROCESSING','UNKNOWN'].includes(p.status)) throw conflict('Pagamento já possui resultado definitivo');
  const result=await deps.gateway.check({paymentId:p.id,transactionId:p.gateway_transaction_code});
  if (result.status==='UNKNOWN') return {payment:p,requiresReconciliation:true};
  const saved=await deps.paymentStore.finalize(p.id,result,actor);
  return {payment:saved,conciliado:true};
}
