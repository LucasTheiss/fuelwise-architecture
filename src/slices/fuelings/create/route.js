import { route } from '../../../shared/http/register.js';
import { z,uuid,fuelType } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'post','/api/v1/fuelings',{
  roles:['DRIVER'],status:201,
  body:z.object({tripId:uuid,stationId:uuid,fuelType:fuelType,
    liters:z.coerce.number().positive().max(10000).refine(v=>Math.abs(v*1000-Math.round(v*1000))<1e-7,{message:'Litros aceita até 3 casas decimais'})}).strict(),execute
},deps);
