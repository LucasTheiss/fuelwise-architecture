export class DomainError extends Error {constructor(kind,message){super(message);this.kind=kind;}}
export const missing=()=>new DomainError('not_found','Viagem não encontrada');
export const conflict=message=>new DomainError('conflict',message);
const sameId=(a,b)=>typeof a==='string'&&typeof b==='string'&&a.toLowerCase()===b.toLowerCase();
export function assertVisible(trip,actor){if(!trip||!sameId(trip.carrier_id,actor.carrierId)||(actor.role==='DRIVER'&&!sameId(trip.driver_id,actor.id)))throw missing();}
export function assertFinishable(trip,pending){if(trip.status!=='IN_PROGRESS')throw conflict('Viagem já finalizada');if(pending)throw conflict('Existem abastecimentos pendentes');}
export function assertEditable(trip){if(trip.status!=='IN_PROGRESS')throw conflict('Viagem já finalizada');}
export function assertDeletable(trip){if(trip.status!=='FINISHED')throw conflict('Finalize a viagem antes de desativar');}
