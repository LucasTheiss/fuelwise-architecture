import { route } from '../../../shared/http/register.js';
import { z,paging } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'get','/api/v1/audit/payments',{
  roles:['ADMIN','MANAGER'],query:paging.extend({carrierId:z.string().uuid().optional()}),execute
},deps);
