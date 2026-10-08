import { route } from '../../../shared/http/register.js';
import { z,uuid } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'post','/api/v1/admin/payments/:id/reconcile',{
  roles:['ADMIN'],params:z.object({id:uuid}),execute
},deps);
