/** StationRepository: create(data), list(query), get(id), update(id,data), deactivate(id),
 * addPrice(id,price), prices(id,query), ready(). UUIDs are stable across migration.
 * Identity: authenticate(bearer) -> {id,role,carrierId}. No client role headers. */
export function requireRepository(repository) {
  for (const method of ['create','list','get','update','deactivate','addPrice','prices','ready']) {
    if (typeof repository[method] !== 'function') throw Error(`Missing repository port: ${method}`);
  }
  return repository;
}
