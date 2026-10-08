import { route } from '../../../shared/http/register.js';
import { paging,z } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'get','/api/v1/admin/carriers/requests',{
  roles:['ADMIN'],query:paging.extend({status:z.enum(['PENDING','ACTIVE','REJECTED']).default('PENDING')}),execute
},deps);
