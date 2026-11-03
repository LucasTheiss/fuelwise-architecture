import {asyncRoute,roles,uuid,paging,createSchema,updateSchema} from '../../api/http.js';
import {execute} from './useCase.js';
export const register=(app,deps)=>app.patch('/api/v1/trips/:id/finish',roles('MANAGER','DRIVER'),asyncRoute(async(q,r)=>r.status(200).json(await execute({actor:q.actor,bearer:q.headers.authorization,id:uuid.parse(q.params.id),query:paging.parse(q.query)},deps))));
