import { calculateTotal } from '../../../domain/fueling.js';
/** Registra o abastecimento. O valor vem da regra de domínio, nunca do cliente. */
export async function execute({actor,body},deps) {
  const fueling=await deps.fuelingStore.request(actor,body,price=>calculateTotal(body.liters,price));
  return {fueling};
}
