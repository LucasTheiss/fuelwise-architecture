import { asyncRoute,roles,station,listing,uuid } from '../../api/http.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>app.delete('/api/v1/stations/:id',roles('ADMIN'),asyncRoute(async(req,res)=>res.status(200).json(await execute(uuid.parse(req.params.id),deps))));
