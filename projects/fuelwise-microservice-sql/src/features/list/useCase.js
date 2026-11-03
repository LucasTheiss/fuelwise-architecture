import {assertVisible,assertFinishable,assertEditable,assertDeletable} from '../../domain/trip.js';
export async function execute({actor,body,query,id,bearer},{repository,fleet}){return {items:await repository.list(actor,query),page:query.page,limit:query.limit};}
