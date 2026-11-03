import {assertVisible,assertFinishable,assertEditable,assertDeletable} from '../../domain/trip.js';
export async function execute({actor,body,query,id,bearer},{repository,fleet}){return {trip:await repository.mutate(id,actor,trip=>{assertDeletable(trip);return {changes:{is_active:false},type:'TripDeactivated'};})};}
