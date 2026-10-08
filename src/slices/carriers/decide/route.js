import { route } from '../../../shared/http/register.js';
import { z,uuid } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'patch','/api/v1/admin/carriers/:id/decision',{
  roles:['ADMIN'],params:z.object({id:uuid}),body:z.object({decision:z.enum(['APPROVE','REJECT']),reason:z.string().max(500).optional()}).strict(),execute
},deps);
