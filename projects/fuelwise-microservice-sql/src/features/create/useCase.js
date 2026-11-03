import {assertVisible,assertFinishable,assertEditable,assertDeletable} from '../../domain/trip.js';
export async function execute({actor,body,query,id,bearer},{repository,fleet}){await fleet.validateAssignment(actor,body,bearer);return {trip:await repository.create({...body,carrierId:actor.carrierId})};}
