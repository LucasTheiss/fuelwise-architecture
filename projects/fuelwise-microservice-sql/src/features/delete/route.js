import {asyncRoute,roles,uuid,paging,createSchema,updateSchema} from '../../api/http.js';
import {execute} from './useCase.js';
export const register=(app,deps)=>app.delete('/api/v1/trips/:id',roles('MANAGER'),asyncRoute(async(q,r)=>r.status(200).json(await execute({actor:q.actor,bearer:q.headers.authorization,id:uuid.parse(q.params.id),query:paging.parse(q.query)},deps))));
