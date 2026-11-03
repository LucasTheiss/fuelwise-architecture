import {asyncRoute,roles,price,paging,uuid} from '../../api/http.js';
import {execute} from './useCase.js';
export function register(app,deps){
app.post('/api/v1/stations/:id/prices',roles('ADMIN'),asyncRoute(async(q,r)=>r.status(201).json(await execute({id:uuid.parse(q.params.id),data:price.parse(q.body)},deps))));
app.get('/api/v1/stations/:id/prices',asyncRoute(async(q,r)=>r.json(await execute({id:uuid.parse(q.params.id),query:paging.extend({type:price.shape.fuelType.optional()}).parse(q.query)},deps))));
}
