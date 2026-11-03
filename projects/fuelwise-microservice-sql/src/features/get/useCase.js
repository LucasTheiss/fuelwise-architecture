import {assertVisible,assertFinishable,assertEditable,assertDeletable} from '../../domain/trip.js';
export async function execute({actor,body,query,id,bearer},{repository,fleet}){const trip=await repository.get(id,actor);assertVisible(trip,actor);return {trip};}
