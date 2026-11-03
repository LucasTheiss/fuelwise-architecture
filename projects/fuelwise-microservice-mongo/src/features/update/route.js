import { asyncRoute,roles,station,listing,uuid } from '../../api/http.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>app.put('/api/v1/stations/:id',roles('ADMIN'),asyncRoute(async(req,res)=>res.status(200).json(await execute({id:uuid.parse(req.params.id),data:station.parse(req.body)},deps))));
