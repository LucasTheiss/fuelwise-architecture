import { asyncRoute,roles,station,listing,uuid } from '../../api/http.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>app.get('/api/v1/stations',roles('ADMIN','MANAGER','DRIVER'),asyncRoute(async(req,res)=>res.status(200).json(await execute(listing.parse(req.query),deps))));
