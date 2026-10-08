import Decimal from 'decimal.js';
Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });
export function calculateFuelingTotal(liters, price) {
  const q = new Decimal(liters), p = new Decimal(price);
  if (!q.isFinite() || !p.isFinite() || q.lte(0) || p.lte(0)) throw Error('Quantidade e preço devem ser positivos');
  const total = q.mul(p).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  if (total.lte(0) || total.gt('9999999999.99')) throw Error('Valor fora do intervalo');
  return total.toFixed(2);
}
