import {assertVisible,assertFinishable,assertEditable,assertDeletable} from '../../domain/trip.js';
export async function execute({actor,body,query,id,bearer},{repository,fleet}){return {trip:await repository.mutate(id,actor,trip=>{assertEditable(trip);return {changes:{notes:body.notes},type:'TripUpdated'};})};}
