import { asyncRoute,roles,station,listing,uuid } from '../../api/http.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>app.post('/api/v1/stations',roles('ADMIN'),asyncRoute(async(req,res)=>res.status(201).json(await execute(station.parse(req.body),deps))));
