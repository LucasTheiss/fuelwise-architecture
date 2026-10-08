/** Payment use case depends on narrow ports, never directly on pg or provider SDK. */
export async function execute({actor,params},deps) {
  const {payment,newlyCreated}=await deps.paymentStore.reserve(actor,params.id);
  if (!newlyCreated) return {payment:payment,reused:true,note:'Não houve nova cobrança'};
  try {
    const gatewayResult=await deps.gateway.charge({paymentId:payment.id,amount:payment.amount,idempotencyKey:payment.idempotency_key});
    const saved=await deps.paymentStore.finalize(payment.id,gatewayResult,actor);
    return {payment:saved,reused:false,simulated:deps.isPaymentMock};
  } catch(error) {
    // No reply from gateway is NOT proof of rejection. Reconcile, do not charge again.
    console.error(JSON.stringify({level:'error',event:'gateway_ambiguous',paymentId:payment.id,error:error.message}));
    const saved=await deps.paymentStore.finalize(payment.id,{status:'UNKNOWN',transactionId:null,message:'Falha de comunicação; requer conciliação'},actor);
    return {payment:saved,reused:false,requiresReconciliation:true,message:'Resultado desconhecido; não efetue nova cobrança'};
  }
}
