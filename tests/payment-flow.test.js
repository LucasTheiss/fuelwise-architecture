import test from 'node:test';
import assert from 'node:assert/strict';
import { execute } from '../src/slices/payments/pay/useCase.js';
const actor={id:'motorista-1',carrier_id:'t-1'};
const params={id:'fueling-1'};
const payment={id:'payment-1',amount:'99.10',idempotency_key:'fuelwise:fueling-1',status:'PROCESSING'};
function ports({existing=false,failCharge=false,declined=false}={}) {
  const calls={reserve:0,charge:0,finalize:[]};
  return {calls,deps:{isPaymentMock:true,
    paymentStore:{
      reserve:async()=>{calls.reserve++;return {payment,newlyCreated:!existing};},
      finalize:async (_id,result)=>{calls.finalize.push(result.status);return {...payment,status:result.status};}
    },
    gateway:{charge:async()=>{calls.charge++;if(failCharge)throw Error('timeout');
      return {status:declined?'REJECTED':'APPROVED',transactionId:'ref-1'};}}
  }};
}
test('nova cobrança gera um único envio ao gateway',async()=>{
  const {deps,calls}=ports();const r=await execute({actor,params},deps);
  assert.equal(calls.charge,1);
  assert.deepEqual(calls.finalize,['APPROVED']);
  assert.equal(r.payment.status,'APPROVED');
});
test('repetição não efetua nova cobrança',async()=>{
  const {deps,calls}=ports({existing:true});const r=await execute({actor,params},deps);
  assert.equal(calls.charge,0);
  assert.equal(r.reused,true);
});
test('timeout é indeterminado, nunca aprovação ou recusa presumida',async()=>{
  const {deps,calls}=ports({failCharge:true});const previous=console.error;console.error=()=>{};
  try {const r=await execute({actor,params},deps);
    assert.equal(r.requiresReconciliation,true);
    assert.deepEqual(calls.finalize,['UNKNOWN']);
  } finally { console.error=previous; }
});
test('recusa explícita do gateway é preservada',async()=>{
  const {deps,calls}=ports({declined:true});const r=await execute({actor,params},deps);
  assert.equal(r.payment.status,'REJECTED');
  assert.deepEqual(calls.finalize,['REJECTED']);
});
