// Testes unitários da camada de domínio (Entities): regras puras, sem banco e sem HTTP.
import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotal, decide, assertPayable, statusAfterPayment, FuelingStatus } from '../src/domain/fueling.js';
import { idempotencyKey, canBeFinalized, assertReconcilable, isDefinitive } from '../src/domain/payment.js';
import { DomainError } from '../src/domain/errors.js';

const kind = (k) => (err) => err instanceof DomainError && err.kind === k;

test('valor do abastecimento é litros x preço, arredondado em centavos', () => {
  assert.equal(calculateTotal(10.5, '5.899'), '61.94');
  assert.equal(calculateTotal('100', '6.00'), '600.00');
});

test('valor do abastecimento recusa litros ou preço não positivos', () => {
  assert.throws(() => calculateTotal(0, '5.00'), kind('validation'));
  assert.throws(() => calculateTotal(10, '-1'), kind('validation'));
});

test('gerente aprova ou recusa só abastecimento aguardando aprovação', () => {
  const pending = { status: FuelingStatus.AWAITING_APPROVAL };
  assert.equal(decide(pending, 'APPROVE'), FuelingStatus.APPROVED);
  assert.equal(decide(pending, 'REJECT'), FuelingStatus.REJECTED);
  assert.throws(() => decide({ status: FuelingStatus.APPROVED }, 'APPROVE'), kind('conflict'));
});

test('só se paga abastecimento aprovado de viagem em andamento', () => {
  assert.doesNotThrow(() => assertPayable({ status: FuelingStatus.APPROVED }, 'IN_PROGRESS'));
  assert.throws(() => assertPayable({ status: FuelingStatus.AWAITING_APPROVAL }, 'IN_PROGRESS'), kind('conflict'));
  assert.throws(() => assertPayable({ status: FuelingStatus.APPROVED }, 'FINISHED'), kind('conflict'));
});

test('resultado do pagamento define o novo estado do abastecimento', () => {
  assert.equal(statusAfterPayment('APPROVED'), FuelingStatus.PAID);
  assert.equal(statusAfterPayment('REJECTED'), FuelingStatus.PAYMENT_REJECTED);
  assert.equal(statusAfterPayment('UNKNOWN'), FuelingStatus.PAYMENT_UNKNOWN);
});

test('chave de idempotência é única por abastecimento', () => {
  assert.equal(idempotencyKey('f-1'), 'fuelwise:f-1');
});

test('pagamento com resultado definitivo não recebe outro resultado', () => {
  assert.equal(canBeFinalized({ status: 'PROCESSING' }), true);
  assert.equal(canBeFinalized({ status: 'UNKNOWN' }), true);
  assert.equal(canBeFinalized({ status: 'APPROVED' }), false);
  assert.throws(() => assertReconcilable({ status: 'REJECTED' }), kind('conflict'));
});

test('só APPROVED e REJECTED do gateway são resultados definitivos', () => {
  assert.equal(isDefinitive('APPROVED'), true);
  assert.equal(isDefinitive('REJECTED'), true);
  assert.equal(isDefinitive('UNKNOWN'), false);
});
