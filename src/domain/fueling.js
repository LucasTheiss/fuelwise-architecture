import Decimal from 'decimal.js';
import { invalid, conflict } from './errors.js';

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

/** Estados do abastecimento, iguais aos do CHECK da tabela fueling. */
export const FuelingStatus = Object.freeze({
  AWAITING_APPROVAL: 'AWAITING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PAID: 'PAID',
  PAYMENT_REJECTED: 'PAYMENT_REJECTED',
  PAYMENT_UNKNOWN: 'PAYMENT_UNKNOWN'
});

/** Valor do abastecimento: litros x preço vigente, arredondado em centavos. */
export function calculateTotal(liters, pricePerLiter) {
  const q = new Decimal(liters), p = new Decimal(pricePerLiter);
  if (!q.isFinite() || !p.isFinite() || q.lte(0) || p.lte(0)) throw invalid('Quantidade e preço devem ser positivos');
  const total = q.mul(p).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  if (total.lte(0) || total.gt('9999999999.99')) throw invalid('Valor fora do intervalo');
  return total.toFixed(2);
}

/** O gerente só decide abastecimentos que ainda aguardam aprovação. */
export function decide(fueling, decision) {
  if (fueling.status !== FuelingStatus.AWAITING_APPROVAL) throw conflict('Abastecimento já analisado');
  if (decision === 'APPROVE') return FuelingStatus.APPROVED;
  if (decision === 'REJECT') return FuelingStatus.REJECTED;
  throw invalid('Decisão deve ser APPROVE ou REJECT');
}

/** Só se paga abastecimento aprovado pelo gerente e de viagem em andamento. */
export function assertPayable(fueling, tripStatus) {
  if (fueling.status !== FuelingStatus.APPROVED || tripStatus !== 'IN_PROGRESS') {
    throw conflict('Viagem precisa estar ativa e fueling aprovado pelo manager');
  }
}

/** Estado do abastecimento depois do resultado do pagamento. */
export function statusAfterPayment(paymentStatus) {
  if (paymentStatus === 'APPROVED') return FuelingStatus.PAID;
  if (paymentStatus === 'REJECTED') return FuelingStatus.PAYMENT_REJECTED;
  return FuelingStatus.PAYMENT_UNKNOWN;
}
