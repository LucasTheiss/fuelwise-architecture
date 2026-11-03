import { missing } from '../../domain/errors.js';
export async function execute({id,data,query},{repository}){if(!await repository.get(id))throw missing();return data?{price:await repository.addPrice(id,data)}:{items:await repository.prices(id,query),page:query.page,limit:query.limit};}
