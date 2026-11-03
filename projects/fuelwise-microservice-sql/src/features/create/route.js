import {asyncRoute,roles,uuid,paging,createSchema,updateSchema} from '../../api/http.js';
import {execute} from './useCase.js';
export const register=(app,deps)=>app.post('/api/v1/trips',roles('MANAGER'),asyncRoute(async(q,r)=>r.status(201).json(await execute({actor:q.actor,bearer:q.headers.authorization,body:createSchema.parse(q.body),query:paging.parse(q.query)},deps))));
