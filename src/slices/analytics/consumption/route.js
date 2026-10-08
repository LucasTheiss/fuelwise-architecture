import { route } from '../../../shared/http/register.js';
import { z } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'get','/api/v1/analytics/fuelings',{
  roles:['ADMIN','MANAGER'],query:z.object({startDate:z.string().date(),endDate:z.string().date(),carrierId:z.string().uuid().optional()}).refine(v=>v.startDate<=v.endDate,{message:'Data inicial maior que final'}),execute
},deps);
