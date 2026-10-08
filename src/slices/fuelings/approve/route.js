import { route } from '../../../shared/http/register.js';
import { z,uuid } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'patch','/api/v1/fuelings/:id/decision',{
  roles:['MANAGER'],params:z.object({id:uuid}),body:z.object({decision:z.enum(['APPROVE','REJECT'])}).strict(),execute
},deps);
