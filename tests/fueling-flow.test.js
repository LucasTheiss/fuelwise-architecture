// Testes unitários dos casos de uso do núcleo financeiro com portas falsas (sem banco).
import test from 'node:test';
import assert from 'node:assert/strict';
import { execute as requestFueling } from '../src/slices/fuelings/create/useCase.js';
import { execute as decideFueling } from '../src/slices/fuelings/approve/useCase.js';
import { execute as reconcile } from '../src/slices/payments/reconcile/useCase.js';
import { DomainError } from '../src/domain/errors.js';

const actor = { id: 'u-1', carrier_id: 't-1' };

test('abastecimento usa o valor calculado pelo domínio com o preço vigente do posto', async () => {
  const deps = { fuelingStore: { request: async (_actor, body, priceRule) => ({ ...body, total_amount: priceRule('6.00') }) } };
  const r = await requestFueling({ actor, body: { tripId: 't', stationId: 's', fuelType: 'DIESEL', liters: 50 } }, deps);
  assert.equal(r.fueling.total_amount, '300.00');
});

test('decisão do gerente passa pela regra de domínio', async () => {
  const store = (status) => ({ fuelingStore: { decide: async (_a, id, rule) => ({ id, status: rule({ status }) }) } });
  const ok = await decideFueling({ actor, params: { id: 'f-1' }, body: { decision: 'APPROVE' } }, store('AWAITING_APPROVAL'));
  assert.equal(ok.fueling.status, 'APPROVED');
  await assert.rejects(decideFueling({ actor, params: { id: 'f-1' }, body: { decision: 'APPROVE' } }, store('PAID')),
    (e) => e instanceof DomainError && e.kind === 'conflict');
});

function reconcilePorts(payment, gatewayStatus) {
  const calls = { finalize: [] };
  return { calls, deps: {
    paymentStore: { find: async () => payment, finalize: async (_id, result) => { calls.finalize.push(result.status); return { ...payment, status: result.status }; } },
    gateway: { check: async () => ({ status: gatewayStatus, transactionId: 'ref-1' }) }
  } };
}

test('conciliação finaliza o pagamento quando o gateway já tem o resultado', async () => {
  const { deps, calls } = reconcilePorts({ id: 'p-1', status: 'UNKNOWN' }, 'APPROVED');
  const r = await reconcile({ actor, params: { id: 'p-1' } }, deps);
  assert.deepEqual(calls.finalize, ['APPROVED']);
  assert.equal(r.payment.status, 'APPROVED');
});

test('conciliação não muda nada enquanto o gateway não sabe o resultado', async () => {
  const { deps, calls } = reconcilePorts({ id: 'p-1', status: 'UNKNOWN' }, 'UNKNOWN');
  const r = await reconcile({ actor, params: { id: 'p-1' } }, deps);
  assert.deepEqual(calls.finalize, []);
  assert.equal(r.requiresReconciliation, true);
});

test('conciliação recusa pagamento que já tem resultado definitivo', async () => {
  const { deps } = reconcilePorts({ id: 'p-1', status: 'APPROVED' }, 'APPROVED');
  await assert.rejects(reconcile({ actor, params: { id: 'p-1' } }, deps), (e) => e instanceof DomainError && e.kind === 'conflict');
});
