import { route } from '../../../shared/http/register.js';
import { z,uuid,fuelType } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'post','/api/v1/stations/:id/prices',{
  roles:['ADMIN'],status:201,params:z.object({id:uuid}),
  body:z.object({fuelType:fuelType,pricePerLiter:z.coerce.number().positive().max(99999).refine(v=>Math.abs(v*1000-Math.round(v*1000))<1e-7,{message:'Preço aceita até três casas decimais'})}).strict(),execute
},deps);
