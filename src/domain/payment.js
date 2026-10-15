import { conflict } from './errors.js';

/** Estados do pagamento, iguais aos do CHECK da tabela payment. */
export const PaymentStatus = Object.freeze({
  PROCESSING: 'PROCESSING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  UNKNOWN: 'UNKNOWN'
});

/** Uma chave por abastecimento: repetir a cobrança nunca gera outra no gateway. */
export const idempotencyKey = (fuelingId) => `fuelwise:${fuelingId}`;

/** Só pagamentos sem resultado definitivo podem receber um resultado. */
export function canBeFinalized(payment) {
  return payment.status === PaymentStatus.PROCESSING || payment.status === PaymentStatus.UNKNOWN;
}

export function assertReconcilable(payment) {
  if (!canBeFinalized(payment)) throw conflict('Pagamento já possui resultado definitivo');
}

/** Resposta ausente do gateway não é recusa: o resultado fica UNKNOWN para conciliação. */
export function isDefinitive(gatewayStatus) {
  return gatewayStatus === PaymentStatus.APPROVED || gatewayStatus === PaymentStatus.REJECTED;
}
