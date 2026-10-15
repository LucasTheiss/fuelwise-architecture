import { assertReconcilable,isDefinitive } from '../../../domain/payment.js';
import { notFound } from '../../../domain/errors.js';
/** Concilia um pagamento sem resultado usando só as portas paymentStore e gateway. */
export async function execute({actor,params},deps) {
  const payment=await deps.paymentStore.find(params.id);
  if (!payment) throw notFound('Pagamento');
  assertReconcilable(payment);
  const result=await deps.gateway.check({paymentId:payment.id,transactionId:payment.gateway_transaction_code});
  if (!isDefinitive(result.status)) return {payment,requiresReconciliation:true};
  const saved=await deps.paymentStore.finalize(payment.id,result,actor);
  return {payment:saved,conciliado:true};
}
