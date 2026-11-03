/** TripRepository: create(data), list(actor,query), get(id,actor),
 * mutate(id,actor,rule), ready(). mutate applies a pure rule under a row lock.
 * Fleet: validateAssignment(actor,body,bearer), hasPending(actor,id,bearer).
 * Outbox is written in the SAME transaction as each trip mutation. */
export function requireRepository(repository){for(const m of ['create','list','get','mutate','ready'])if(typeof repository[m]!=='function')throw Error(`Missing port ${m}`);return repository;}
