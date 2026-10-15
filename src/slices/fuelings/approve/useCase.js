import { decide } from '../../../domain/fueling.js';
/** O gerente aprova ou recusa. Quem decide se a transição é válida é a regra de domínio. */
export async function execute({actor,params,body},deps) {
  const fueling=await deps.fuelingStore.decide(actor,params.id,current=>decide(current,body.decision));
  return {fueling};
}
