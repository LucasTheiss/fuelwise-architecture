import { route } from '../../../shared/http/register.js';
import { z,uuid } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'post','/api/v1/complaints',{
  roles:['ADMIN','MANAGER','DRIVER'],status:201,
  body:z.object({stationId:uuid.optional(),paymentId:uuid.optional(),description:z.string().trim().min(10).max(2000)}).strict().refine(v=>Boolean(v.stationId)!==Boolean(v.paymentId),{message:'Informe stationId OU paymentId'}),execute
},deps);
