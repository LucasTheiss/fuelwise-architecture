import { route } from '../../../shared/http/register.js';
import { z,uuid } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'patch','/api/v1/admin/complaints/:id/moderate',{
  roles:['ADMIN'],params:z.object({id:uuid}),body:z.object({status:z.enum(['UNDER_REVIEW','RESOLVED','REJECTED']),note:z.string().trim().min(5).max(1000)}).strict(),execute
},deps);
